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

function deleteCritters(docs) {
  docs = docs.map(function(d) { d._deleted = true; return d; })
  console.log(
    "curl -X POST http://max.ic.ht/critters/_bulk_docs -d '" +
    JSON.stringify({docs: docs}) +
    "' -H 'content-type: application/json'"
  )
}

function renderCritters (critters) {
    var wrapper = document.getElementById('critters-wrapper');

    wrapper.innerHTML = renderCrittersList({'critters': critters});
    document.querySelector('body').addEventListener('click', function (e) {
        if (e.target.className === 'btn-delete') {
            var checkboxNodes = document.querySelectorAll('input[type="checkbox"]')
            var checked = []
            Array.prototype.slice.call(checkboxNodes).map(function(checkbox) {
                if (!checkbox.checked) return
                checked.push({
                  _id: checkbox.attributes['data-id'].textContent,
                  _rev: checkbox.attributes['data-rev'].textContent
                })
            })
            if (checked.length === 0) return
            deleteCritters(checked)
        }
    });
}

function createCritter (data) {
    return data.map(function (row) {
        return {
            id: row.id,
            rev: row.doc._rev,
            author: row.doc.author,
            link: row.doc.link,
            name: row.doc.name
        };
    });
}
