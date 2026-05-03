import json
import logging
import traceback
from pydantic import BaseModel

def log_route(endpoint: str, status: int, data: dict, response:dict=None, error:str=None):
    json_data = data
    if isinstance(data,dict):
        json_data = json.dumps(data)
    elif isinstance(data, BaseModel):
        json_data = data.model_dump_json()
        
    json_response = json.dumps(response) if isinstance(response, dict) else str(response)
    
    if isinstance(error, Exception):
        error = traceback.format_exception(type(error), error, error.__traceback__)

    if status // 100 == 5:
        logging.error(f"api -> {endpoint} called with error -> {status} {str(error)} data -> {json_data}")
    elif status // 100 == 4:
        logging.warning(f"api -> {endpoint} called with warning -> {status} {str(error)} data -> {json_data}")
    else:
        logging.info(f"api -> {endpoint} called with status -> {status} data -> {json_data} response -> {json_response}")