from config import config_dict
import os
import logging
import time

app_dir = config_dict.APP_DIRECTORY
static_dir = config_dict.STATIC_DIRECTORY
logs_dir = os.path.join(config_dict.STATIC_DIRECTORY, "logs")
project_name = config_dict.PROJECT_NAME

def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    log_format = f'{project_name}: %(name)s - %(levelname)s - %(message)s'
    file_log_format = '%(asctime)s.%(msecs)03d - ' + log_format + '%(filename)s:%(lineno)d'
    timestamp = time.strftime("%Y-%m-%d_%H-%M")
    os.makedirs(logs_dir, exist_ok=True)
    file_handler = logging.FileHandler(os.path.join(logs_dir, f"{timestamp}.log"))
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter(
    file_log_format,
    datefmt='%Y-%m-%d %H:%M:%S'
    ))
    logger.addHandler(file_handler)
    logger.info("Starting")
    
    # Обработчик для вывода в консоль
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(log_format))
    logger.addHandler(console_handler)