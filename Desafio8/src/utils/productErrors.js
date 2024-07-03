import os from "os"

export function productsArguments(argument){
    return `
    
Invalid arguments:

Mandatory arguments:      

      - title
      - description
      - code
      - price
      - status
      - stock
      - category
      - thumbnails
      
      ${argument} is missing or invalid...!

Date: ${new Date().toUTCString()}
User: ${os.userInfo().username}
Terminal: ${os.hostname()}

`

}