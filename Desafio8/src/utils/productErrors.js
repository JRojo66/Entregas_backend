import os from "os"

export function productsArguments(argument){
    return `
    
Invalid arguments:

Mandatory arguments:      

      - title (String)
      - description (String)
      - code (String)
      - price (Number)
      - status (Boolean)
      - stock (Number)
      - category (String)
      - thumbnails (Array)
      
      ${argument} is missing or invalid...!

Date: ${new Date().toUTCString()}
User: ${os.userInfo().username}
Terminal: ${os.hostname()}

`

}