<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header/clock/ltr/ltr.css?__inline');
<%else%> 
@import url('/widget/header/clock/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
<%require name="common:widget/header/clock/ltr/ltr.more.css"%> 
<%else%> 
<%require name="common:widget/header/clock/rtl/rtl.more.css"%> 
<%/if%>

<%if !empty($body.headerTest.widget)%><div class="userbar-date-wrapper"><%/if%>
<div class="userbar-date" id="dateBox" log-mod="date" monkey="date"<%if !empty($body.date.fontSize)%> style="font-size:<%$body.date.fontSize%>"<%/if%>></div>
<%if !empty($body.headerTest.widget)%></div><%/if%>

<%widget name="common:widget/header/clock/clock-conf/clock-conf.tpl"%>
<%script%>
	conf.calendar = <%json_encode($body.date.calendar)%> || {};

	require.async("common:widget/ui/jquery/jquery.js", function($) {
		$(window).one("e_go.clock", function () {
			require.async("common:widget/header/clock/clock-async.js", function () {
				Gl.clock("dateBox");
			});
		});

		$(function () {
			$(window).trigger("e_go.clock");
		});
	});
<%/script%>
