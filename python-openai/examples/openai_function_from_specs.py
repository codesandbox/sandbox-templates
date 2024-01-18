from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


if __name__ == "__main__":
    client = OpenAI()

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "user",
                "content": "Write a Python function that takes as input a file path to an image, loads the image into memory as a numpy array, then crops the rows and columns around the perimeter if they are darker than a threshold value. Use the mean value of rows and columns to decide if they should be marked for deletion."
            }
        ],
        temperature=0.7,
        max_tokens=64,
        top_p=1
    )
    print(response)

