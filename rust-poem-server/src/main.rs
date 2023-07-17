use poem::{get, handler, listener::TcpListener, web::Path, Route, Server};

#[handler]
fn index() -> String {
    format!("go to /CodeSandbox to see some magic happen!")
}

#[handler]
fn hello(Path(name): Path<String>) -> String {
    format!("hello: {}", name)
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    println!("Starting Poem Server");
    let app = Route::new().at("/", get(index)).at("/:name", get(hello));
    Server::new(TcpListener::bind("0.0.0.0:3000"))
        .run(app)
        .await
}
