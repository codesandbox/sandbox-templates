# Rust + Poem REST Server

Here you have a Poem server running. You can see the output by looking [here](http://localhost:3000) and putting something in the path.

Check out [src/main.rs](./src/main.rs) for the code. When you save, it will automatically recompile and show a new version thanks to [`cargo-watch`](https://crates.io/crates/cargo-watch).

To add a new dependency, open a new terminal (```CMD/Ctrl + ` ```) and run `cargo add ...`.

After rebuilding the environment by changing the [Dockerfile](./.codesandbox/Dockerfile), you might have to restart `rust-analyzer` by doing `CMD/Ctrl+K` and "Restart rust server" or restart the VM by clicking the CodeSandbox logo (in the top left) and clicking "Restart Instance".