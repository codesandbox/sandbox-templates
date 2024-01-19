from openai import OpenAI
from dotenv import load_dotenv
import os

if __name__ == "__main__":
    #If env var is not set fallback to dotfile
    os.environ.get('OPENAI_API_KEY', load_dotenv())
    client = OpenAI()

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "You will be provided with a piece of Python code, and your task is to find and fix bugs in it."
            },
            {
                "role": "user",
                "content": "import Random\n    a = random.randint(1,12)\n    b = random.randint(1,12)\n    for i in range(10):\n        question = \"What is \"+a+\" x \"+b+\"? \"\n        answer = input(question)\n        if answer = a*b\n            print (Well done!)\n        else:\n            print(\"No.\")"
            }
        ],
        temperature=0.7,
        max_tokens=64,
        top_p=1
    )
    print(response)

