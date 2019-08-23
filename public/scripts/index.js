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

    function getService(serviceId) {

        $.getJSON(`api/services/${serviceId}`, (service) => {
            $(".card .card-img-top").attr("src", "images/doubleliftpurebliss.jpg");
            $(".card .card-title").html(service.ServiceName);
            $(".card h4").html("$" + Number(service.Price).toFixed(2));
            $(".card .card-text").html(service.Description);

            // $("#cardTitle").html("Product ID:" + service.ServiceID);
            // $("#cardText1").html("Product Name:" + service.ServiceName);
            // $("#cardText2").html("Unit Price:" + Number(service.Price).toFixed(2));

            // $("#productCard").show();
        })

    }
});