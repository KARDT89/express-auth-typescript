
import type { Request, Response } from "express";
import { createHmac, randomBytes } from "node:crypto"
import { signinPayloadModel, signupPayloadModel } from "./models.js";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { createUserToken } from "./utils/tokens.js";
import type {UserTokenPayload} from './utils/tokens.js'

class AuthenticationController {
    public async handleSignup(req: Request, res: Response){
        const validationResult = await signupPayloadModel.safeParseAsync(req.body);
        if(validationResult.error) return res.status(400).json({ message: "body validation failed", error: validationResult.error.issues });


        const {firstName, lastName, email, password} = validationResult.data;
        const userEmailResult = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if(userEmailResult.length > 0) return res.status(400).json({ error: "duplicate entry",message: "email already exists" });

        const salt = randomBytes(32).toString("hex");
        const hash = createHmac("sha256", salt).update(password).digest("hex");

        const result = await db.insert(usersTable).values({
            firstName,
            lastName,
            email,
            password: hash,
            salt
        }).returning({id: usersTable.id});
        console.log(result);
        return res.status(201).json({ message: "user created", data: {id: result[0]?.id} });
    }
    public async handleSignin(req: Request, res: Response){
         const validationResult = await signinPayloadModel.safeParseAsync(req.body);
        if(validationResult.error) return res.status(400).json({ message: "body validation failed", error: validationResult.error.issues });

        const {email, password} = validationResult.data;

        const [userSelect] = await db.select().from(usersTable).where(eq(usersTable.email, email))
        if(!userSelect) return res.status(404).json({ error: "not found", message: `user with this ${email} does not exist` });

        const salt = userSelect.salt!;
        const hash = createHmac("sha256", salt).update(password).digest("hex");

        if(userSelect.password !== hash) return res.status(400).json({ error: "unauthorized", message: "invalid credentials" });

        //token banao

        const token = createUserToken({id: userSelect.id})

        return res.json({ message: "signin successful", data: {token} });
    }

    public async handleGetMe(req: Request, res: Response){
        // @ts-ignore
        const {id} = req.user as UserTokenPayload

        const userResult = await db.select().from(usersTable).where(eq(usersTable.id, id))
        return res.json({ message: "user data fetched successfully", data: userResult[0] });
    }
}

export default AuthenticationController;