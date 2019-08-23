"use strict"
$(document).ready(function() {

    getCategories();


    function getCategories() {
        $.getJSON('api/categories/', (categories) => {
            console.log(categories)
            $.each(categories, (index, category) => {
                $("#categoryList").append($("<a />")
                    .text(category.Category)
                    .attr("class", "dropdown-item")
                    .attr("href", "#")
                    .on("click", (e) => {
                        e.preventDefault();
                        $("#categoryName").text(category.Category);
                        getServices(category.Value);
                    })
                )
            });

        });

    }

    /**
     * 
     * @param {*} category 
     */
    function getServices(category) {
        $.getJSON(`api/services/bycategory/${category}`, (services) => {

            $("#servicesList").html('');
            $("#productCard").hide();

            $.each(services, (index, service) => {
                $("#servicesList").append($("<a />")
                    .text(service.ServiceName)
                    .attr("class", "dropdown-item")
                    .attr("href", "#")
                    .on("click", (e) => {
                        e.preventDefault();
                        getService(service.ServiceID);
                    })
                )
            });
        });
    }

    /**
     * 
     * @param {*} serviceId 
     */
    function getService(serviceId) {

        $.getJSON(`api/services/${serviceId}`, (service) => {
            console.log(service);

            $(".card .card-img-top").attr("src", "images/doubleliftpurebliss.jpg");
            $(".card .card-title").html(service.ServiceName);
            $(".card h4").html("$" + Number(service.Price).toFixed(2));
            $(".card .card-text").html(service.Description);

            $.each(service.Reviews, (index, review) => {
                console.log(review);
                $("#card-review .card-body").prepend($("<hr>"));
                $("#card-review .card-body").prepend($("<small />")
                    .html('Posted by ' + review.PostedBy + ' ' + review.Date)
                    .attr("class", "text-muted")
                );
                $("#card-review .card-body").prepend($("<p />").html(review.Description));

            });

            // $("#productCard").show();
        })
    };

});