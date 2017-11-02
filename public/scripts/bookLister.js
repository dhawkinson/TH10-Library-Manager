'use.strict';
// set the parameters
bookLister: function() {
    currPage = req.query.page;
    search_title = req.query.title;
    author = req.query.author;
    genre = req.query.genre;
    first_published = req.query.first_published;
    
    const columns = [
        "Title",
        "Author",
        "Genre",
        "First Published"
    ];
    
    const bookData = books.rows.map(book => {
        return book.get({
            plain: true
        });
    });
    
    const pgCount = Math.ceil(books.count / 10);
    
    const title = "Books";
    
    res.render('list_selector', {
        entity,
        title,
        columns,
        bookData,
        pgCount,
        currPage,
        filter,
        sub_title,
        end_point,
        search_title,
        author,
        genre,
        first_published,
        search
    });
}
module.exports = bookLister;
