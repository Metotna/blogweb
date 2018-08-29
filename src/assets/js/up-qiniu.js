// var CryptoJS =require('./crypto-js.min.js')
import CryptoJS from 'crypto-js'
var basect = {
    /**
     * base64编码
     * @param {Object} str
     */
    base64encode: function(str) {
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    },
    /**
     * utf16转utf8
     * @param {Object} str
     */
    utf16to8: function(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else
            if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    },
    safe64: function(val) {
        val = val.replace(/\+/g, "-");
        val = val.replace(/\//g, "_");
        return val;
    }
}
export default {
    iconDec() {
        var tempn = String(Date.parse(new Date()) / 1000);
        tempn = tempn.substring(3, 10);
        var putPolicy = {
            scope: "sc-opt",
            isPrefixalScope: 1,
            saveKey: tempn + ".jpg",
            deadline: Date.parse("2888-12-12") / 1000,
            fileType: 1,
            returnBody: '{"name": $(key),"hash": $(etag)}'
        };
        var a = 'yN2Cap59vAi2p8nu-mm6cztjuMQw6FOpWfiKV9YV'
        var b = 'IE7gPHBuCMdfKCb6-TjjbxCadGJCO6kQXFoloAVA'
        var c = putPolicy
        var put_policy = JSON.stringify(c);
        var encoded = basect.base64encode(basect.utf16to8(put_policy));
        var hash = CryptoJS.HmacSHA1(encoded, b);
        var encoded_signed = hash.toString(CryptoJS.enc.Base64);
        var upload_token = a + ":" + basect.safe64(encoded_signed) + ":" + encoded;
        return upload_token;
    }
}