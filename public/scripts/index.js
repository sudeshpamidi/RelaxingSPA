"use strict"
$(document).ready(function() {

    //populate the dropdown button
    getCategories();

    /**
     * Get the Categories from JSON file and fill the dropdown button.
     */
    function getCategories() {
        $.getJSON('api/categories/', (categories) => {

            $.each(categories, (index, category) => {
                $("#categoryList").append($("<a />")
                    .text(category.Category)
                    .attr("class", "dropdown-item")
                    .attr("href", "#")
                    .on("click", (e) => {
                        e.preventDefault();
                        //$("body").removeClass("home");
                        $("#categoryName").text(category.Category);
                        getServices(category.Value);
                    })
                )
            });
        });
    }

    /**
     * Get the services for given category and fill the service list.
     * @param {*} category 
     */
    function getServices(category) {
        $.getJSON(`api/services/bycategory/${category}`, (services) => {

            $("#servicesList").html('');

            //show first service details as default 
            getService(services[0].ServiceID);

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
     * Get the service info from JSON file for given service ID.
     * The information will be populated to service/review card control
     * @param {*} serviceId 
     */
    function getService(serviceId) {
        $.getJSON(`api/services/${serviceId}`, (service) => {
            $(".card .card-img-top").attr("src", "images/" + service.Image);
            $(".card .card-title").html(service.ServiceName);
            $(".card h4").html(service.Minutes + " Minutes");
            $("#price").html("$" + Number(service.Price).toFixed(2));
            $(".card .card-text").html(service.Description);
            $("#cardReview").empty();
            $.each(service.Reviews, (index, review) => {
                $("#cardReview").prepend($("<hr>"));
                $("#cardReview ").prepend($("<small />")
                    .html('Posted by ' + review.PostedBy + ' ' + review.Date)
                    .attr("class", "text-muted")
                );
                $("#cardReview").prepend($("<p />").html(review.Description));
            });

            // let textArea = `                                      
            //     <div id="collapseReview" class="collapse" data-parent="#serviceContainer">
            //         <div class="card-body">
            //             <textarea rows="4" cols="100" id="reviewArea"></textarea>
            //         </div>
            //     </div>`;

            $("#cardReview").append($("<button />")
                .attr("class", "btn btn-link collapsed")
                .attr("type", "button")
                .attr("data-toggle", "collapse")
                .attr("data-target", "#collapseReview")
                .html("Leave a Review")
            );

            $("#cardReview").append($("<div />")
                .attr("class", "collapse")
                .attr("id", "collapseReview")
                .attr("data-parent", "#serviceContainer")
            );

            $("#cardReview #collapseReview").append($("<div />")
                .attr("class", "card-body")
            );

            $("#collapseReview .card-body").append($("<textarea />")
                .attr("rows", "4")
                .attr("cols", "100")
                .attr("id", "reviewArea")
            );
            //$("#cardReview").append(textArea);

            $("#collapseReview .card-body").append($("<button />")
                .attr("class", "btn btn-success")
                .attr("type", "button")
                .html("Submit")
                .on("click", (e) => {
                    e.preventDefault();
                    addReview(service.ServiceID);
                })
            );

            $("#homeContainer").hide();
            $("#serviceContainer").show();
        });
    };

    /**
     * adds a review to JSON.
     * @param {*} serviceid 
     */
    function addReview(serviceid) {
        let url = "/api/review";
        let postData = "&description=" + $("#reviewArea").val();
        postData = postData + "&postedby=" + "Anonymous";
        postData = postData + "&serviceid=" + serviceid;

        if ($("#reviewArea").val().trim() != "") {
            $.ajax({
                    url: url,
                    type: "POST",
                    data: postData
                })
                .done(function() {
                    getService(serviceid);
                });
        };
    };

});