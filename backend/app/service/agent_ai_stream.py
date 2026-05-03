
from typing import Type, TypeVar, Optional
import logging
import requests
import asyncio
import json
import logging
import os
from pathlib import Path
import re
from typing import Callable
import aiohttp
from config import config_dict
from configparser import ConfigParser
from pydantic import BaseModel

from database.models import Agent
from service.tokenizer import Tokenizer
from utils.log_route import log_route

CHAT_AI_KEY = config_dict.CHAT_AI_KEY

agents_config = ConfigParser()
tokenizer = Tokenizer()

async def agent_make_history(agent: Agent, messages, max_tokens=10000, params: dict = {}):
    """Формируем историю на основе необходимого системного промпта и переданных сообщений."""
    sum_input_tokens = 0
    max_output_tokens = None
    
    # agents_config.read(Path(config_dict.STATIC_DIRECTORY) / "agents.ini")
    # formatted_prompt = agents_config["PROMPTS"][agent_name]

    formatted_prompt = agent.prompt
    
    prompt_input_tokens = tokenizer.tokens_sum(formatted_prompt)
    sum_input_tokens += prompt_input_tokens
    
    if max_tokens < max_tokens:
        messages, sum_input_tokens = tokenizer.limit_messages_max_tokens(messages=[messages[-1]], sum_tokens=sum_input_tokens, max_tokens=max_tokens)
        max_output_tokens = max_tokens - prompt_input_tokens
    else:
        messages, sum_input_tokens = tokenizer.limit_messages_max_tokens(messages=messages, sum_tokens=sum_input_tokens, max_tokens=max_tokens)
    system_message = {"role": "system", "content": formatted_prompt}
    messages.insert(0, system_message)
    
    return (messages, sum_input_tokens, max_output_tokens)
    
TAgentResponseSchema = TypeVar("T", bound=BaseModel)

def agent_ai(messages, model, temperature:Optional[float]=None, response_format:Optional[dict]=None,  response_model: Optional[Type[TAgentResponseSchema]] = None, max_output_tokens=None, subscription_tokens_left=0)-> TAgentResponseSchema:
    input_tokens_used = 0
    output_tokens_used = 0
    total_tokens_used = 0
    message_content = ""
    error_content = ""

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {CHAT_AI_KEY}",
        # "Content-Type": "application/json"
    }
    data = {
        "model": f"{model}",
        "messages": messages,
        "stream": False,
        "max_tokens": 500,
        "reasoning": {
            "enabled": False
        },
    }

    if (bool(temperature)):
        data["temperature"] = temperature

    if bool(max_output_tokens):
        data["max_tokens"] = max_output_tokens

    if bool(response_format):
        data["response_format"] = response_format

    json_data=json.dumps(data, ensure_ascii=False)
    logging.info(f"REQUEST DATA: {json_data}")
    response = requests.post(url=url, data=json_data, headers=headers)
    
    data = response.json()
    choices = data.get("choices", [])
    content  = choices[0]["message"]["content"]
    data = content.replace('\\"', '"')
   
    log_route(endpoint=url, status=200, data=data)

    if response_model:
        parsed_dict = json.loads(data)
        return response_model(**parsed_dict)
    data = json.loads(data)
    return data

    

async def agent_ai_stream(messages, model, temperature, max_output_tokens=None, subscription_tokens_left=0, on_complete=Callable, on_failed=Callable):
    MIN_LEFT_TOKENS = 400
    
    # tokenizer = Tokenizer()
    # load_dotenv()
    # openai.api_key = os.getenv("OPENAI_API_KEY")
    # proxy_url = os.getenv("PROXY_URL")

    input_tokens_used = 0
    output_tokens_used = 0
    total_tokens_used = 0
    message_content = ""
    error_content = ""

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {CHAT_AI_KEY}",
    }
    data = {
        "model": f"{model}",
        "messages": messages,
        "stream": True,
        "temperature": temperature,
        "max_tokens": 500
    }

    if bool(max_output_tokens):
        data["max_tokens"] = max_output_tokens

    # tokenizer = Tokenizer()
    

    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(url, headers=headers, json=data) as response:
                async for line in response.content:
                    if line:
                        line = line.decode('utf-8')
                        if line.startswith('data: '):
                            data_line = line[6:]
                            if data_line == '[DONE]':
                                break
                            else:
                                yield data_line + '\n'
                                match = re.search(r'"content":"(.*?)"', data_line)
                                if match:
                                    content = match.group(1)
                                    content = content.replace("\\n", "\n")
                                    message_content += content
                                    # output_tokens_used += tokenizer.tokens(content)
                        #Собираем ошибку
                        else:
                            error_content += line

                total_tokens_used = input_tokens_used + output_tokens_used
                tokens_left = subscription_tokens_left-total_tokens_used
                if tokens_left <= MIN_LEFT_TOKENS:
                    tokens_left = 0

                logging.info(f"Messages sent to OpenAI: {json.dumps(messages, ensure_ascii=False)}")
                logging.info(f"Tokens spent by OpenAI: total -> {str(total_tokens_used)} input -> {str(input_tokens_used)} output -> {str(output_tokens_used)} response -> {json.dumps(message_content, ensure_ascii=False)}")
                yield '{"response_content": ' + json.dumps(message_content, ensure_ascii=False) + ', "subscription_tokens_left": ' + str(tokens_left) + ', "total_tokens": ' + str(total_tokens_used) + ', "input_tokens": ' + str(input_tokens_used) + ', "output_tokens": ' + str(output_tokens_used) + '}'
                if bool(len(error_content.strip())):
                    yield '\n{"error_content": "' + error_content + '"}'
                await on_complete(message_content, total_tokens_used, input_tokens_used, output_tokens_used)
        except aiohttp.ClientError as e:
            pass
            # log_route(endpoint=url, status=500,data={"messages":messages}, error=f"{str(e)}. {error_content}")
            # raise HTTPException(status_code=500)