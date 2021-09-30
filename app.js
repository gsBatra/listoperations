// Gagandeep Batra
// List Operations using Firebase
// CMPSC 487W
// Professor Ngyuen
// 9/29/2021

$(document).ready(function () {
    function browseList(doc, ul) {
        // create the li
        let li = document.createElement('li');

        // create the div
        let div = document.createElement('div');
        div.id = "item";

        // create the id header
        let id = document.createElement('p');
        id.id = "item_id";

        // create the name header
        let name = document.createElement('p');
        name.id = "item_name";

        // create the description header
        let description = document.createElement('p');
        description.id = "item_description"

        // create the img
        let img = document.createElement('p');
        img.id = "item_img";

        id.textContent = "ID: " + doc.id;
        name.textContent = "Name: " + doc.data().name;
        description.textContent = "Description: " + doc.data().description;
        img.textContent = "Img: " + doc.data().img;

        div.appendChild(id);
        div.appendChild(name);
        div.appendChild(description);
        div.appendChild(img);
        li.appendChild(div);
        ul.appendChild(li);
    }

    function clearLists(){
        $('#browse_list').empty();
        $('#sort_list').empty();
        $('#search_list').empty();
    }

    // List Operation 1: Browse List
    $('#browse_btn').click(function () {
        clearLists();
        let ul = document.getElementById("browse_list");
        db.collection("items").onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                switch (change.type) {
                    case "added":
                        browseList(change.doc, ul);
                        break;
                    default:
                        break;
                }
            });
        });
    });

    // List Operation 2: Sort List By Name
    $('#sort_btn').click(function () {
       clearLists();
        let ul = document.getElementById("sort_list");
        db.collection("items").orderBy("name").onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                switch (change.type) {
                    case "added":
                        browseList(change.doc, ul);
                        break;
                    default:
                        break;
                }
            });
        });
    });

    // List Operation 3: Search by name
    $('#search').submit(function (e) {
        e.preventDefault();
        clearLists();
        let keyword = $('#search_box').val().toLowerCase();
        let ul = document.getElementById("search_list");
        db.collection("items").orderBy("name").startAt(keyword).endAt(keyword + "\uf8ff").onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                switch (change.type) {
                    case "added":
                        browseList(change.doc, ul);
                        break;
                    default:
                        break;
                }
            });
        });
        return false;
    });

    // List Operation 4: Add to database
    $('#add').submit(function(e) {
        e.preventDefault();
        clearLists();
        let keyword = $('#add_box').val().toLowerCase();
        let doc_id = db.collection("items").doc().id; // creates new doc id
        db.collection("items").doc(doc_id).set({
            id: doc_id,
            name: keyword,
            description: "test description",
            img: "test img",
        });
        $('browse_btn').click();
        return false;
    });

    // List Operation 5: Edit
    $('#edit_btn').click(function() {
        clearLists();
        db.collection("items").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.update({
                    description: "edit test"
                });
            });
        });
    })

    // List Operation 6: Delete
    $('#delete').submit(function (e) {
        e.preventDefault();
        clearLists();
        let keyword = $('#delete_box').val().toLowerCase();
        let query = db.collection("items").where('name','==',keyword);
        query.get().then(function(snapshot) {
            snapshot.forEach(function(doc){
                doc.ref.delete();
            });
        });
        return false;
    });

});