sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note over browser,server: sending data in JSON: {content: "fffff", date: "2026-06-08T09:26:50.431Z"}
    Note right of server: Server saves the new note into the notes array
    server-->>browser: HTTP status code 201 Created
    deactivate server

    Note right of browser: The browser dynamically adds the new note to the list using JS (NO page reload!)