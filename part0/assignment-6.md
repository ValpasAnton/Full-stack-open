```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Status code: 201 created
    deactivate server

Note right of browser: When the form is being sent to the browser, an event handler in the JavaScript <br> code calls the method e.preventDefault(), which prevents the default form submission,<br>after which the event handler creates the new note and adds it on the page by updating the DOM. <br> After all of this the actual POST method to send the info to the server is called.

 

    