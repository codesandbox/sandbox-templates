from openai import OpenAI
from dotenv import load_dotenv
import os

if __name__ == "__main__":
    #If env var is not set fallback to dotfile
    os.environ.get('OPENAI_API_KEY', load_dotenv())
    client = OpenAI()

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You will be provided with statements, and your task is to convert them to standard English."
            },
            {
                "role": "user",
                "content": "She no went to the market."
            }
        ],
        temperature=0.7,
        max_tokens=64,
        top_p=1
    )
    print(response)

