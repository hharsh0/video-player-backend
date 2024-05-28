import path from "path"
import type { Request, Response, NextFunction } from "express"

export const fileExtLimiter = (allowedExtArray:any) => {
    return (req:Request, res:Response, next:NextFunction) => {
        const files:any = req.files

        const fileExtensions:any = []
        Object.keys(files).forEach(key => {
            fileExtensions.push(path.extname(files[key].name))
        })

        // Are the file extension allowed? 
        const allowed = fileExtensions.every((ext: any) => allowedExtArray.includes(ext))

        if (!allowed) {
            const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", ", ");

            return res.status(422).json({ status: "error", message });
        }

        next()
    }
}