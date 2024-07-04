/**
 * @swagger
 * components:
 *   schemas:
 *     IBaseModelAttributes:
 *       type: object
 *       properties:
 *         createdBy:
 *           type: string
 *         updatedBy:
 *           type: string
 *         _id:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ISocial:
 *       allOf:
 *         - $ref: '#/components/schemas/IBaseModelAttributes'
 *         - type: object
 *           properties:
 *             name:
 *               type: string
 *               enum: [facebook, linkedin]
 *             url:
 *               type: string
 *     IProject:
 *       allOf:
 *         - $ref: '#/components/schemas/IBaseModelAttributes'
 *         - type: object
 *           properties:
 *             name:
 *               type: string
 *             link:
 *               type: string
 *             description:
 *               type: string
 *     IProfileStyle:
 *       type: object
 *       properties:
 *         primaryColor:
 *           type: string
 *     IEducation:
 *       allOf:
 *         - $ref: '#/components/schemas/IBaseModelAttributes'
 *     ILanguage:
 *       allOf:
 *         - $ref: '#/components/schemas/IBaseModelAttributes'
 *         - type: object
 *           properties:
 *             name:
 *               type: string
 *             proficiency:
 *               type: integer
 *               format: int32
 *               description: Proficiency between 0 and 10
 *     ICompany:
 *       allOf:
 *         - $ref: '#/components/schemas/IBaseModelAttributes'
 *         - type: object
 *           properties:
 *             companyName:
 *               type: string
 *             industry:
 *               type: string
 *             jobTitle:
 *               type: string
 *             startDate:
 *               type: string
 *               format: date
 *             endDate:
 *               type: string
 *               format: date
 *               nullable: true
 *             currentlyWorksHere:
 *               type: boolean
 *     IAward:
 *       allOf:
 *         - $ref: '#/components/schemas/IBaseModelAttributes'
 *         - type: object
 *           properties:
 *             title:
 *               type: string
 *             name:
 *               type: string
 *             awardedOn:
 *               type: string
 *               format: date
 *             description:
 *               type: string
 *     ICertificate:
 *       allOf:
 *         - $ref: '#/components/schemas/IBaseModelAttributes'
 *         - type: object
 *           properties:
 *             title:
 *               type: string
 *             name:
 *               type: string
 *             issuedBy:
 *               type: string
 *             awardedOn:
 *               type: string
 *               format: date
 *     IProfile:
 *       allOf:
 *         - $ref: '#/components/schemas/IBaseModelAttributes'
 *         - type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             phoneNumber:
 *               type: string
 *             aboutMe:
 *               type: string
 *             profilePhotoUrl:
 *               type: string
 *             coverPhotoUrl:
 *               type: string
 *             logoUrl:
 *               type: string
 *             socialMedias:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ISocial'
 *             projects:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IProject'
 *             profileStyle:
 *               $ref: '#/components/schemas/IProfileStyle'
 *             educations:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IEducation'
 *             languages:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ILanguage'
 *             companies:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ICompany'
 *             skills:
 *               type: array
 *               items:
 *                 type: string
 *             awards:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IAward'
 *             certificates:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ICertificate'
 *             hobbies:
 *               type: array
 *               items:
 *                 type: string
 *
 * /api/v1/profiles:
 *   get:
 *     summary: Get all profiles
 *     responses:
 *       200:
 *         description: A list of profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IProfile'
 *   post:
 *     summary: Create a new profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IProfile'
 *     responses:
 *       201:
 *         description: The created profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProfile'
 *
 * /api/v1/profiles/{id}:
 *   get:
 *     summary: Get a profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProfile'
 *   put:
 *     summary: Update a profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IProfile'
 *     responses:
 *       200:
 *         description: The updated profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IProfile'
 *   delete:
 *     summary: Delete a profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */

import { Router } from 'express';

const profileRouter = Router();

profileRouter.get('/', (req, res) => {})
profileRouter.post('/', (req, res) => {})
profileRouter.delete('/:id', (req, res) => {})
profileRouter.get('/:id', (req, res) => {})
profileRouter.put('/:id', (req, res) => {})


export { profileRouter };
