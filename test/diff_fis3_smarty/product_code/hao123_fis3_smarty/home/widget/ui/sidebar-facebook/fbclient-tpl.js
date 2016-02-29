/**
 * from conf.facebook
 * @type {{tplPlaceholder: string}}
 */
var TPL_CONF = {

	tplUser: '<a href="https://www.facebook.com/#{usrId}" target="_blank">#{name}</a>'

	, tplAvavatar: '<a href="https://www.facebook.com/#{pId}" target="_blank"><img width=40 height=40 src="https://graph.facebook.com/#{pId}/picture"></a>'

	, tplLi: '<li class="fb-mod_li" data-id="#{id}" data-userID="#{usrId}"><div class="fb-mod_li_avatar"><a href="https://www.facebook.com/#{usrId}" target="_blank"><img width=40 height=40 src="https://graph.facebook.com/#{usrId}/picture"></a></div> <div class="fb-mod_li_c"> <p class="fb-mod_li_actice"><a href="#{homepage}" target="_blank" class="fb-mod_li_author">#{author}</a><br/> #{message}</p>#{photo}#{video}#{quote}<div class="fb-mod_li_bar"><a href="###" onClick="return !1" class="fb-mod_li_like">#{tplLike}</a> · <a href="###" onClick="return !1" class="fb-mod_li_share">#{tplShare}</a> · <span class="fb-mod_li_time">#{time}</span></div></div> <a href="###" onClick="return !1" class="fb-mod_li_close">&times;</a></li>'

	, tplQuote: '<div class="fb-mod_li_video fb-mod_li_link"><div class="fb-mod_li_video_cover" style="width:100%;text-align:left;padding-left:5px;line-height:normal;"><a class="fb-mod_li_video_c" href="#{href}" target="_blank"><span class="fb-mod_li_video_t">#{title}</span></a><p class="fb-mod_li_video_caption">#{caption}</p><p class="fb-mod_li_video_des">#{des}</p></div></div>'

	, tplPlaceholder: '<div class="fb-mod_placeholder" data-first="#{first}" data-last="#{last}"></div>'
};

module.exports = TPL_CONF;

