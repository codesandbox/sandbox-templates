# Jupyter Notebook

This is a starter template for [Jupyter Notebook and Lab](https://jupyter.org/). It's a great starting point for any Python, Machine Learning, or AI project in CodeSandbox.

## Getting Started

The base image for Jupyter Notebook in CodeSandbox based on the [Jupyter Docker Stacks images](https://github.com/jupyter/docker-stacks).

Check [the Dockerfile](./.devcontainer/Dockerfile) to see how we configure the container of this sandbox. You can simply edit it yourself and the container will rebuild. Make sure to fork the sandbox first by clicking "Fork" in the top left corner. 


You can also change the Jupyter Notebook settings that you can edit in [tasks.json](./.codesandbox/tasks.json). Please note, by default the CodeSandbox notebook will start that you probably want to change for your project.

## Jupyter Lab

In case you would like to use Jupyter Lab just you have to start the `Jupyter Lab` tasks or run

```bash
jupyter lab --ip='*' --NotebookApp.token='' --NotebookApp.password='' --NotebookApp.allow_remote_access=True  --ServerApp.disable_check_xsrf=True --allow-root
```

## Learn More

To learn more about Jupyter, take a look at the following resources:

- [Jupyter](https://docs.jupyter.org/en/latest/) - learn about Jupyter.
- [Jupyter Documentation](https://jupyter-notebook.readthedocs.io/) - learn about Jupyter Notebooks, configuration, and additional settings.
- [Jupyter Lab Documentation](https://jupyterlab.readthedocs.io/en/stable/index.html) - learn about Jupyter Notebooks and its configuration.

