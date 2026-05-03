import tiktoken

class Tokenizer:
    def __init__(self, model="gpt-4o-mini"):
        self.tokens_per_message = 3
        self.tokens_per_name = 1
        self.encoder = tiktoken.encoding_for_model(model)
        self.tokenizer = tiktoken.get_encoding(self.encoder.name)

    def tokens_sum(self, text):
        return len(self.tokenizer.encode(text))

    def limit_messages_max_tokens(self, messages, sum_tokens = 0, max_tokens = 1000):
        limited_messages = []
        # sum_tokens += 3  # Начальное количество токенов, например, для системных сообщений
        for message in messages:
            message_tokens = self.tokens_per_message

            # Рассчитываем количество токенов для всех ключей сообщения, кроме "context_ended"
            for key, value in message.items():
                if key == "context_ended":
                    if value is True:  # Если "context_ended" равно True, пропускаем это сообщение
                        return (list(reversed(limited_messages)), sum_tokens)
                    continue  # Пропускаем ключ "context_ended" без учета токенов
                
                if key == "content":
                    message_tokens += self.tokens_sum(value)

                if key == "name":
                    message_tokens += self.tokens_per_name

            # Проверяем, превышает ли добавление текущего сообщения допустимый лимит токенов
            if sum_tokens + message_tokens >= max_tokens:
                return (list(reversed(limited_messages)), sum_tokens)

            # Добавляем сообщение в ограниченный массив
            if "context_ended" in message:
                del message["context_ended"]    
            limited_messages.append(message)
            sum_tokens += message_tokens

        return (list(reversed(limited_messages)), sum_tokens)


