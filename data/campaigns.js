let campaigns = [
    {
        campaign_id: 1,
        company_id: 1,
        product_id: 1,
        campaign_name: "Gates for everyone",
        keywords: [
            "one for each",
            "limited offer"
        ],
        bid_amount: 25000,
        status: true,
        town: "Tarnow",
        radius: "10"
    },
    {
        campaign_id: 2,
        company_id: 1,
        product_id: 3,
        campaign_name: "Get them while they last",
        keywords: [
            "rare",
            "one for each",
            "limited offer"
        ],
        bid_amount: 25000,
        status: false,
        town: "Tarnow",
        radius: "10"
    },
    {
        campaign_id: 3,
        company_id: 3,
        product_id: 1,
        campaign_name: "Let the shine power your ship",
        keywords: [
            "electricity",
            "green technology",
        ],
        bid_amount: 25000,
        status: true,
        town: "Tarnow",
        radius: "10"
    }
]

module.exports = {
    campaigns: campaigns
}