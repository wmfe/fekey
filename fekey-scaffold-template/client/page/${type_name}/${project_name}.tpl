{% extends 'node_h5:page/layout.tpl' %}
{% block title %}
template
{% endblock %}

{% block static %}
    <div style='display:none;'>
        <img src='https://s.waimai.baidu.com/c/static/h5/shareimage/default-share.jpg'>
    </div>
{% endblock %}

{% block content %}
    {% widget 'node_h5:widget/{{-type_name-}}/{{-project_name-}}/index.tpl' %}
{% endblock %}
