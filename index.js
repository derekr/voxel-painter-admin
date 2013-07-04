var Handlebars = require('handlebars');
var request    = require('browser-request');

var content = document.getElementById('critters-list-template').textContent;
var renderCrittersList = Handlebars.compile(content);

request.couch({
    method: 'GET',
    url: 'http://maxcors.jit.su/http://max.ic.ht/critters/_all_docs?include_docs=true'
}, function (err, res, body) {
    renderCritters(createCritter(body.rows));
});

function renderCritters (critters) {
    var wrapper = document.getElementById('critters-wrapper');

    wrapper.innerHTML = renderCrittersList({'critters': critters});
    document.querySelector('body').addEventListener('click', function (e) {
        if (e.target.className === 'btn-delete') {
            var id = e.target.attributes['data-id'].textContent;
            var key = e.target.attributes['data-key'].textContent;
            console.log('remove: ', id, key);
            // handle deleting?
        }
    });
}

function createCritter (data) {
    return data.map(function (row) {
        return {
            id: row.id,
            key: row.key,
            author: row.doc.author,
            link: row.doc.link,
            name: row.doc.name
        };
    });
}
