const { response } = require('express');

const companies = require('./data/companies').companies;
let campaigns = require('./data/campaigns').campaigns;
const tags = require('./data/tags').tags;
const towns = require('./data/towns').towns;

let removeCampaign = (arr, id) => {   
    return arr.filter((ele) => { 
        return ele.campaign_id != id; 
    });
}

const findCampaignId = (id) => {
    const item = campaigns.filter((obj) => {
        return obj.campaign_id === parseInt(id);
    })
    console.log("lista: ", campaigns,"id: ", id ,"item: ", item, "cos: ", campaigns.indexOf(item[0]))
    if( item.length < 1 )
        return { status: false }
    return { status: true, indeks: campaigns.indexOf(item[0]) }
}

let checkMandatoryCampaignParams = (obj) => {
    let mandatoryParams = {
        company_id: false,
        product_id: false,
        campaign_name: false,
        keywords: false,
        bid_amount: false,
        status: false,
        town:  false,
        radius: false
    };

    for (const [objKey, objValue] of Object.entries(obj)) {
        for (const [manKey, manValue] of Object.entries(mandatoryParams)) {
            if( objKey === manKey && !!objValue ){
                if( objKey === "keywords" ){
                    if ( objValue.length > 0 )
                        mandatoryParams.keywords = true 
                } else if ( objKey === "bid_amount" ){
                    if( objValue > 1000 )
                        mandatoryParams.bid_amount = true
                } else {
                    mandatoryParams[objKey] = true;
                }
            }
        }
    }

    if( Object.values(mandatoryParams).
        filter((elem) => elem === false)
        .length > 0
        )
        return false
    else
        return true
}

let findFirstEmptyCompaignId = () => {
    let id = 1;
    while(id){
        let isFree = true;
        campaigns.filter((elem) => {
            if(elem.campaign_id === id)
                isFree = false;
        })
        if( isFree )
            return id
        else
            id++
    }
}

module.exports = function (){
    this.dataEndpoint = (router) => {
        //** Endpoint for GET request for comapnies */
        router.get('/api/companies', async (request, response, next) => {
            console.log("getting comapnies");
            response.status(200).send({companies: companies});
        });

        //** Endpoint for GET request for campaigns */
        router.get('/api/campaigns', async (request, response, next) => {
            console.log("getting cmapigns");
            response.status(200).send({campaigns: campaigns});
        });

        //** Endpoint for GET request for tags */
        router.get('/api/tags', async (request, response, next) => {
            console.log("getting tags");
            response.status(200).send({tags: tags});
        });

        //** Endpoint for GET request for towns */
        router.get('/api/towns', async (request, response, next) => {
            console.log("getting towns");
            response.status(200).send({towns: towns});
        });

        //** Endpoint for GET request for comapnies products list */
        router.get('/api/companies_products/:id', async (request, response, next) => {
            console.log("getting comapnies_prodcuts with this id: "+request.params.id);
            const company_id = parseInt(request.params.id-1);
            if( 
                !isNaN(company_id) && 
                companies[company_id] !== undefined 
                )
                response.status(200).send(companies[company_id].products_list); 
            else
                response.status(404).end();
        });

        //** Endpoint for POST request for campaigns */
        router.post('/api/campaign', async (request, response, next) => {
            let newCampaign = request.body;
            if( checkMandatoryCampaignParams(newCampaign) ){
                newCampaign["campaign_id"] = findFirstEmptyCompaignId();
                campaigns.push(newCampaign);
                console.log("New campaign added with campaign_id: "+newCampaign.campaign_id);
                response.status(200).send({campaign: newCampaign});
            } else {
                response.status(404).send("Data was incorrect");
            }
        });

        //** Endpoint for DELETE request for campaigns */
        router.delete('/api/campaigns/:id', (req, res) => {
            const campaign_id = parseInt(req.params.id);
            const campaign_object = campaigns.find(element => element.campaign_id === campaign_id)
            console.log(campaign_id, campaign_object)
            if( !isNaN(campaign_id) &&
                !!campaign_object
                ){
                campaigns = removeCampaign(campaigns, campaign_id);
                console.log("deleted campaign with id: "+campaign_id);
                res.status(200).send('Got a DELETE request for campaign with id: '+campaign_id);
            } else
                res.status(404).end();
          })

        //** Endpoint for PUT request for campaigns */
        router.put('/api/campaign/:id', async (request, response, next) => {
            let newCampaign = request.body;
            console.log(newCampaign)
            if( checkMandatoryCampaignParams(newCampaign) ){
                const output = findCampaignId(request.params.id);
                if (  output.status ){
                    newCampaign["campaign_id"] = parseInt(request.params.id);
                    campaigns[output.indeks] = newCampaign;
                    console.log("Campaign modified with campaign_id: "+newCampaign.campaign_id);
                    response.status(200).send({campaign: newCampaign});
                } else {
                    response.status(404).send("Item not found");
                }
            } else {
                response.status(404).send("Data was incorrect");
            }
        });
    };
}