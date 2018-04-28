import HttpRequest from '@/utils/fetch';

/**
 * 异步发起action公共方法
 * @param {*} params 传的参数
 * @param {*} type 
 */
const fetchFriends = (params, type) => dispatch => {
  HttpRequest(params, (res) => {
    dispatch({ type, payload: res })
  })
}

// 获取cookie
function getCookie(name)
{
    var arr=document.cookie.split('; ');
    var i=0;
    for(i=0;i<arr.length;i++)
    {
        var arr2=arr[i].split('=');
         
        if(String(arr2[0])===String(name))
        {  
            var getC = decodeURIComponent(arr2[1]);
            return getC;
        }
    }
    
    return '';
}

// 设置Cookie;
function setCookie(name, value, iDay) {
    var oDate=new Date();

    oDate.setDate(oDate.getDate()+iDay);

    document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate;
}

// 删除cookie;
function removeCookie(name) {
    setCookie(name, '1', -1);
}

// 截取URL的字符值
function getURLValue (name) {
    let search = window.location.search;
    let value = search.split(name)[1].split('=')[1];

    if (value.indexOf('&') > -1) {
        value = value.split('&')[0];
    }

    return value;
}

/**
    @box - 整个图片区域的容器元素
    @imgBoxWidth - 图片容器宽度
    @imgBoxHeight - 图片容器高度
**/
function imgBox(box, imgBoxWidth, imgBoxHeight) {
    var imgs = document.querySelectorAll(box + ' img');
    for (var i = 0; i < imgs.length; i++) {
        imgAuto(imgs[i], imgBoxWidth, imgBoxHeight);
    }
}

/**
    @elm - 图片元素
    @parentWidth - 容器宽度
    @parentHeight - 容器高度
**/
function imgAuto (img, parentWidth, parentHeight) {
    var imgWidth = img.offsetWidth;
    var imgHeight = img.offsetHeight;
    console.log(imgWidth)

    // 当图片的宽高大于容器的宽高
    if (imgWidth > parentWidth && imgHeight > parentHeight) {
        if (imgWidth > imgHeight) {
            img.style.width = 'auto';
            img.style.height = parentHeight + 'px';
        } else {
            img.style.width = parentWidth + 'px';
            img.style.height = 'auto';
        }
    }

    // 当图片的宽高小于容器的宽高
    if (imgWidth < parentWidth && imgHeight < parentHeight) {
        var widthMultiple = (parentWidth / imgWidth).toFixed(2);
        var heightMultiple = (parentHeight / imgHeight).toFixed(2);

        if (widthMultiple >= heightMultiple) { // 对比width，height相差的倍数
            img.style.width = imgWidth*widthMultiple + 'px';
            img.style.height = imgHeight*widthMultiple + 'px';
        } else {
            img.style.width = imgWidth*heightMultiple + 'px';
            img.style.height = imgHeight*heightMultiple + 'px';
        }
    }

    // 当图片宽度大于容器宽度，高度小于容器高度
    if (imgWidth > parentWidth && imgHeight < parentHeight) {
        img.style.height = parentHeight + 'px';
        img.style.width = 'auto';
    }

    // 当图片高度大于容器高度，宽度小于容器宽度
    if (imgWidth < parentWidth && imgHeight > parentHeight) {
        img.style.height = 'auto';
        img.style.width = parentWidth + 'px';
    }

    // 使图片水平垂直居中
    img.style.marginLeft = '-' + Math.ceil(img.offsetWidth - parentWidth)/2 + 'px';
    img.style.marginTop = '-' + Math.ceil(img.offsetHeight - parentHeight)/2 + 'px';
}

export { getCookie, setCookie, removeCookie, getURLValue, fetchFriends, imgBox };