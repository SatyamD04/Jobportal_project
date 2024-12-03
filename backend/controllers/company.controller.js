import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

//------ Creating Company Or registering company -------
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            })
        }
        let company = await Company.findOne({
            name: companyName
        })
        if (company) {
            return res.status(400).json({
                message: "Company already exists, Pls register with other name",
                success: false
            })
        }

        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company created/registered successfully",
            company,
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}

//--- get all companies detail with perticular userID ---
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; //---- geting those company only that user created with this id---
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "No companies found",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//----- getting company by companyId -----
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id; //--why params used..?
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "No company found",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//----- updating company information/details -----
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        const file = req.file;  //---for logo/images--
        //---cloudinary comes here---
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;

        const updateData = { name, description, website, location, logo };
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Company information updated successfully.",
            success: true
        })
    } catch (error) {
        console.log(error)
    }

}