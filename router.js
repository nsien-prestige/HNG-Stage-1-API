const express = require('express');
const axios = require('axios');
const Profile = require('./model');
const { uuidv7 } = require('uuidv7');


const router = express.Router()

router.post('/profiles', async(req, res) => {
    // Validation Code

    const rawName = req.body.name;

    if(rawName === undefined || rawName === null || rawName === '') {
        return res.status(400).json({
            "status": "error",
            "message": "Name query parameter is required"
        })
    }

    if (typeof rawName !== 'string') {
        return res.status(422).json({
            "status": "error",
            "message": "Name query parameter must be a string"
        })
    }

    const name = rawName.trim();

    if (!name) {
        return res.status(400).json({
            "status": "error",
            "message": "Name query parameter is required"
        })
    }

    if (!isNaN(name)) {
        return res.status(422).json({
            "status": "error",
            "message": "Invalid name format. Name should not be a number."
        })
    }

    const isValidName = /^[a-zA-Z\s'\-]+$/.test(name)
    const notSymbolsOnly = /[a-zA-Z]+/.test(name)

    if (!isValidName || !notSymbolsOnly) {
        return res.status(422).json({
            "status": "error",
            "message": "Invalid name format. Name should not start with a symbol and should only contain letters, spaces, apostrophes, or hyphens."
        })
    }

    try {
        const existingProfile = await Profile.findOne({ name: name.toLowerCase() })

        if (existingProfile) {
            return res.status(200).json({
                "status": "success",
                "message": "Profile already exists",
                "data": existingProfile
            })
        }
        const response = await Promise.all ([
            axios.get(`https://api.genderize.io?name=${name}`),
            axios.get(`https://api.agify.io?name=${name}`),
            axios.get(`https://api.nationalize.io?name=${name}`)
        ])
        
        const genderizeData = response[0].data
        const agifyData = response[1].data
        const nationalizeData = response[2].data
        const uniqueId = uuidv7()

        if (genderizeData.gender === null || genderizeData.count === 0) {
            return res.status(502).json({
                "status": "error",
                "message": "Genderize returned an invalid response"
            })
        }

        if (agifyData.age === null) {
            return res.status(502).json({
                "status": "error",
                "message": "Agify returned an invalid response"
            })
        }

        if (nationalizeData.country.length === 0) {
            return res.status(502).json({
                "status": "error",
                "message": "Nationalize returned an invalid response"
            })
        }

        await Profile.create({
            id: uniqueId,
            name: name.toLowerCase(),
            gender: genderizeData.gender,
            gender_probability: genderizeData.probability,
            sample_size: genderizeData.count,
            age: agifyData.age,
            age_group: getAgeGroup(agifyData.age),
            country_id: nationalizeData.country[0]?.country_id || null,
            country_probability: nationalizeData.country[0]?.probability || null,
            created_at: new Date()
        })

        return res.status(201).json({
            "status": "success",
            "data": {
                "id": uniqueId,
                "name": name.toLowerCase(),
                "gender": genderizeData.gender,
                "gender_probability": genderizeData.probability,
                "sample_size": genderizeData.count,
                "age": agifyData.age,
                "age_group": getAgeGroup(agifyData.age),
                "country_id": nationalizeData.country[0]?.country_id || null,
                "country_probability": nationalizeData.country[0]?.probability || null,
                "created_at": new Date()
            }
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            "status": "error",
            "message": "Failed to fetch data from related APIs"
        })
    }
})

router.get('/profiles', async(req, res) => {
    const gender = req.query.gender
    const age_group = req.query.age_group
    const country_id = req.query.country_id

    const query = {}

    if (gender) query.gender = { $regex: new RegExp(gender, 'i') }
    if (age_group) query.age_group = { $regex: new RegExp(age_group, 'i') }
    if (country_id) query.country_id = { $regex: new RegExp(country_id, 'i') }

    const response = await Profile.find(query)

    return res.status(200).json({
        "status": "success",
        "count": response.length,
        "data": response.map(profile => ({
            "id": profile.id,
            "name": profile.name,
            "gender": profile.gender,
            "age": profile.age,
            "age_group": profile.age_group,
            "country_id": profile.country_id
        }))
    })
})

router.get('/profiles/:id', async(req, res) => {
    const id = req.params.id

    const response = await Profile.findOne({ id })

    if (!response) {
        return res.status(404).json({
            "status": "error",
            "message": "Selected profile not found"
        })
    }

    return res.status(200).json({
        "status": "success",
        "data": {
            "id": response.id,
            "name": response.name,
            "gender": response.gender,
            "gender_probability": response.gender_probability,
            "sample_size": response.sample_size,
            "age": response.age,
            "age_group": response.age_group,
            "country_id": response.country_id,
            "country_probability": response.country_probability,
            "created_at": response.created_at
        }
    })
})

router.delete('/profiles/:id', async (req, res) => {
    const id = req.params.id

    const response = await Profile.findOneAndDelete({ id })

    if (!response) {
        return res.status(404).json({
            "status": "error",
            "message": "Selected profile not found"
        })
    }

    res.status(204).send()
})

const getAgeGroup = (age) => {
    if(age >= 0 && age <= 12) return 'child'
    else if(age >= 13 && age <= 19) return 'teenager'
    else if(age >= 20 && age <= 59) return 'adult'
    else if(age >= 60) return 'senior'
    else return {
        "status": "error",
        "message": "Invalid age value"
    }
}

module.exports = router