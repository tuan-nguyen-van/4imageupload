
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossorigin="anonymous"></script>

<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>

<script src="/js/prism+corefunc.js"></script>
<script type="text/javascript">
    $(document).ready(function () {
        $('#sidebarCollapse').on('click', function () {
            $('#sidebar, #content').toggleClass('active');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
            marginForSideBar();
        });
        $(window).on('resize', function(){
            marginForSideBar();
        });

        function marginForSideBar() {
            if ($(window).width() <= 850) {
                if ($('#sidebar').hasClass('active')) {
                    $('#main-content').css("margin-left", "-250px");
                }
                else {
                    $('#main-content').css("margin-left", "0px");
                }
            }
            else {
                $('#main-content').css("margin-left", "0px");
            }
        }
    });
</script>
