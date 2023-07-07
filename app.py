from fastapi import FastAPI
from flask import Flask, render_template, request, jsonify
#https://deta.space/builder/a0FXdX7Xurch/develop
from chat import get_response
import re

# Flask app initialization

app = Flask(__name__)


@app.get("/")
def index_get():
    return render_template("base.html")


@app.post("/predict")
def predict():
    text = request.get_json().get("message")
    # TODO: dont forget to check if the text is valid
    if not text:
        return jsonify({"error": "Invalid input"})

    if not re.match("^[a-zA-Z0-9]+$", text):
        return jsonify({"error": "Invalid input format"})

    response = get_response(text)
    # the response is put in a python dictionary, so we can jsonify
    message = {"answer": response}
    return jsonify(message)


if __name__ == "__main__":
    app.run(debug=False)