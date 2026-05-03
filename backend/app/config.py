from dataclasses import dataclass, asdict
import os
from typing import Optional

from environs import Env
from pathlib import Path
from sqlalchemy.engine.url import URL


@dataclass
class DbConfig:
    """
    Database configuration class.
    This class holds the settings for the database, such as host, password, port, etc.

    Attributes
    ----------
    host : str
        The host where the database server is located.
    password : str
        The password used to authenticate with the database.
    user : str
        The username used to authenticate with the database.
    database : str
        The name of the database.
    port : int
        The port where the database server is listening.
    """

    host: str
    password: str
    user: str
    database: str
    port: int = 5432

    # For SQLAlchemy
    def construct_sqlalchemy_url(self, driver="asyncpg", host=None, port=None) -> str:
        """
        Constructs and returns a SQLAlchemy URL for this database configuration.
        """

        if not host:
            host = self.host
        if not port:
            port = self.port
        uri = URL.create(
            drivername=f"postgresql+{driver}",
            username=self.user,
            password=self.password,
            host=host,
            port=port,
            database=self.database,
        )
        return uri.render_as_string(hide_password=False)

    @staticmethod
    def from_env(env: Env):
        """
        Creates the DbConfig object from environment variables.
        """
        host = env.str("POSTGRES_HOST", 'localhost')
        password = env.str("POSTGRES_PASSWORD")
        user = env.str("POSTGRES_USER", 'postgres')
        database = env.str("POSTGRES_DB")
        port = env.int("POSTGRES_PORT", 5432)
        return DbConfig(
            host=host, password=password, user=user, database=database, port=port
        )

@dataclass
class Config:
    """
    The main configuration class that integrates all the other configuration classes.

    This class holds the other configuration classes, providing a centralized point of access for all settings.

    Attributes
    ----------
    tg_bot : TgBot
        Holds the settings related to the Telegram Bot.
    misc : Miscellaneous
        Holds the values for miscellaneous settings.
    db : Optional[DbConfig]
        Holds the settings specific to the database (default is None).
    redis : Optional[RedisConfig]
        Holds the settings specific to Redis (default is None).
    """

    PROJECT_NAME: str
    CHAT_AI_KEY: str
    CHROMADB_PORT: str
    ROOT_DIRECTORY: str
    APP_DIRECTORY: str
    STATIC_DIRECTORY: str

    DB: DbConfig


def load_config(path: str = None) -> Config:
    """
    This function takes an optional file path as input and returns a Config object.
    :param path: The path of env file from where to load the configuration variables.
    It reads environment variables from a .env file if provided, else from the process environment.
    :return: Config object with attributes set as per environment variables.
    """

    # Create an Env object.
    # The Env object will be used to read environment variables.
    env = Env()
    
    if path is None:
        path = Path(__file__).parent / ".env"
        
    print("Using env file:", path)

    env.read_env(path)
    
    ROOT_DIRECTORY =  Path(__file__).resolve().parent.parent
    APP_DIRECTORY = ROOT_DIRECTORY / "app"
    STATIC_DIRECTORY = ROOT_DIRECTORY / "static"

    return Config(
        PROJECT_NAME=env.str("PROJECT_NAME", "PROJECT_NAME"),
        CHAT_AI_KEY=env.str("CHAT_AI_KEY", ""),
        CHROMADB_PORT=env.str("CHROMADB_PORT", ""),
        ROOT_DIRECTORY=env.str("ROOT_DIRECTORY", ROOT_DIRECTORY),
        APP_DIRECTORY=env.str("APP_DIRECTORY", APP_DIRECTORY),
        STATIC_DIRECTORY=env.str("STATIC_DIRECTORY", STATIC_DIRECTORY),

        DB=DbConfig.from_env(env)
    )
    
config_dict = load_config()