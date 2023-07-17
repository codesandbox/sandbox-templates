use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct SerializedStruct {
    hello: String,
}

fn main() {
    let object = SerializedStruct {
        hello: "CodeSandbox".into(),
    };

    println!("{}", serde_json::to_string_pretty(&object).unwrap());
}
