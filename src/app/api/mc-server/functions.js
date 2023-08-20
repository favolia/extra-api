const axios = require('axios')

const javaUrl = 'https://api.mcsrvstat.us/3/'
const bedrockUrl = 'https://api.mcsrvstat.us/bedrock/3/'

export const javaServers = async (ipAddress) => {
    if (!ipAddress) return {
        status: false,
        message: "where's the ip?"
    }
    try {
        const { data } = await axios.get(`${javaUrl}${ipAddress}`)
        return {
            status: true,
            data
        }
    } catch (error) {
        return {
            status: false,
            message: 'Something went wrong'
        }
    }
}

export const bedrockServers = async (ipAddress) => {
    if (!ipAddress) return {
        status: false,
        message: "where's the ip?"
    }
    try {
        const { data } = await axios.get(`${bedrockUrl}${ipAddress}`)
        return {
            status: true,
            data
        }
    } catch (error) {
        return {
            status: false,
            message: 'Something went wrong'
        }
    }
}