```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML shell
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: main.css
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: spa.js
    deactivate server

Note right of browser: The browser executes the JavaScript in spa.js to render the page
    browser->>server: GET method in spa.js fetches the JSON info on the notes (GET https://studies.cs.helsinki.fi/exampleapp/data.json)
    activate server
    server-->>browser: data.json
    deactivate server

Note right of browser: JavaScript renders the page with dynamic data fetched from the server


    