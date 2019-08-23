"use strict"
$(document).ready(function() {

    getCategories();


    /**
     * 
     */
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
                        $("body").removeClass("home");
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
            $(".card .card-img-top").attr("src", "images/doubleliftpurebliss.jpg");
            $(".card .card-title").html(service.ServiceName);
            $(".card h4").html("$" + Number(service.Price).toFixed(2));
            $(".card .card-text").html(service.Description);

            $("#card-review").empty();

            $.each(service.Reviews, (index, review) => {
                $("#card-review").prepend($("<hr>"));
                $("#card-review ").prepend($("<small />")
                    .html('Posted by ' + review.PostedBy + ' ' + review.Date)
                    .attr("class", "text-muted")
                );
                $("#card-review").prepend($("<p />").html(review.Description));
            });

            let textArea = `                                      
            <!--<div class="card-header1" id="headingTwo1"> -->
                <h2 class="mb-0">
                    <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseReview" aria-expanded="false" aria-controls="collapseReview">
                    Leave a Review
                  </button>
                </h2>
           <!-- </div> -->
            <div id="collapseReview" class="collapse" aria-labelledby="headingTwo" data-parent="#serviceReviews">
                <div class="card-body">
                <textarea rows="4" cols="100" id="reviewArea"></textarea>
                </div>
            </div>`;

            $("#card-review").append(textArea);

            //$("#card-review").append($("<button />")
            $("#collapseReview .card-body").append($("<button />")

                .attr("class", "btn btn-success")
                .attr("type", "button")
                //.attr("data-toggle", "collapse")
                //.attr("data-target", "#collapseOne")
                .html("Leave a Review")
                .on("click", (e) => {
                    e.preventDefault();
                    addReview(service.ServiceID);
                })
            );
            // $("#productCard").show();
        });
    };

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