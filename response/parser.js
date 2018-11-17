var json = {
    "_text": "Hi! I would love to have a cheese burger.",
    "entities": {
      "order": [
        {
          "confidence": 1,
          "value": "make an order",
          "type": "value"
        }
      ],
      "number_type": [
        {
          "confidence": 0.93659292753156,
          "value": "a",
          "type": "value"
        }
      ],
      "food_type": [
        {
          "confidence": 0.97502182286416,
          "value": "cheese burger",
          "type": "value"
        }
      ],
      "greetings": [
        {
          "confidence": 0.99799096592205,
          "value": "true"
        }
      ]
    },
    "msg_id": "1qyscgWLSTG80kwmC"
  }

console.log(("order" in json.entities))
