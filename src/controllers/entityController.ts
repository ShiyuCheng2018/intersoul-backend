import { Request, Response } from 'express';
import {genders} from "../models/genders";
import {body_types} from "../models/body_types";
import {mediaTypes} from "../models/media_types";
import {logHelper} from "../helper/functionLoggerHelper";
import {sendResponse} from "../helper/sendResponse";

export const getEntities = async (req:any, res: Response) => {
    logHelper({level: "INFO", message: "getEntities",functionName: "getEntities", additionalData: JSON.stringify(req.user)});

    try{
        const _genders = await genders.findAll();
        const _body_types = await body_types.findAll();
        const _media_types = await mediaTypes.findAll();

        return sendResponse(res, 200, true, "Entities fetched successfully.", {
            entities: {
                genders: _genders,
                body_types: _body_types,
                media_types: _media_types
            }
        }, null);
    }catch (error: any){
        return sendResponse(res, 500, false, "Something went wrong with fetching entities.", null, error.message);
    }
}