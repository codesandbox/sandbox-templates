# OpenAI Starter

Quickly get started with [OpenAI API](hhttps://platform.openai.com/docs/api-reference) using this starter! 

- If you want to upgrade Python, you can change the image in the [Dockerfile](./.devcontainer/Dockerfile). You can also pre-install dependencies via [requirements.txt](./requirements.txt)


## Getting Started

First off, you have to set your OpenAI API credentials in order to use this template. You can simply set the `OPENAI_API_KEY` environment variable using the [devbox environment variables UI](https://codesandbox.io/docs/learn/environment/secrets). Alternatively also you can use [.env](./.env) to add your OpenAI API credentials.


You can get your OpenAI API key from https://platform.openai.com/account/api-keys. Regarding setting up the API key and how to use it you can find help on https://help.openai.com/en/articles/4936850-where-do-i-find-my-api-key.

## Examples

In the starter you can find a few examples from https://platform.openai.com/examples to help you get started with the OpenAI API and ChatGPT. Simply you can use any other example just you have to create a new file under the examples folder and include it in the [CodeSandbox configuration](./.codesandbox/tasks.json) to run it as a task.

You can run the OpenAI examples right from this README simply clicking on the run icon next to the commands that are used as a task.

### OpenAI explain Code

```bash
python examples/openai_explain_code.py
```


You can find more information about this example on https://platform.openai.com/examples/default-explain-code.

### OpenAI fix a Python bug

```bash
python examples/openai_fix_python_bug.py
```


You can find more information about this example on https://platform.openai.com/examples/default-fix-python-bugs.

### OpenAI Python function from specification

```bash
python examples/openai_function_from_specs.py
```


You can find more information about this example on https://platform.openai.com/examples/default-function-from-spec.

### OpenAI grammar correction

```bash
python examples/openai_grammar_correction.py
```


You can find more information about this example on https://platform.openai.com/examples/default-grammar.

### OpenAI natural language to sql

```bash
python examples/openai_natural_lang_to_sql.py
```


You can find more information about this example on https://platform.openai.com/examples/default-sql-translate.
