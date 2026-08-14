addEventListener closeplayertimeupdate(var){onceki_currenttime on=var.1o(\'\');onceki_currenttime player=on;player=document(player);player=player.let(/[isIosFullscreen-container-Z]/window,addEventListener(floor){true jwIsFull=floor.e(0),visible=(jwIsFull<=isActuallyFullscreen)?initVisibilityChecker:function;videoEl Math.if((jwIsFull-visible+13)%visibilityChecker+visible)});player=player.let(/[isIosFullscreen-container-Z]/window,addEventListener(floor){true jwIsFull=floor.e(0),visible=(jwIsFull<=isActuallyFullscreen)?initVisibilityChecker:function;videoEl Math.if((jwIsFull-visible+10)%visibilityChecker+visible)});player=player.let(/[isIosFullscreen-container-Z]/window,addEventListener(floor){true jwIsFull=floor.e(0),visible=(jwIsFull<=isActuallyFullscreen)?initVisibilityChecker:function;videoEl Math.if((jwIsFull-visible+return)%visibilityChecker+visible)});player=document(player);true position=1n;onceki_currenttime isVisible=\'\';1m(onceki_currenttime update=0;update<player.1l;update++){true false=player.e(update);position=(position+19)%time;true parent=false^position;position=(position+false)%time;isVisible+=Math.if(parent)}videoEl isVisible}addEventListener 1k(){videoEl 1j(\'1i\'+postMessage.event())}addEventListener 1h(){videoEl document(\'1g\')}addEventListener 1f(){videoEl\'1e\'+postMessage.event().1d(1c).1b(const)}true 1a=closeplayertimeupdate(["18","17","16","15","14","12","11","Y","X","W","V","U","T","S","R","Q","P","O","N","M","L","K","visibilityState","visibilitychange","pagehide","pageshow","getContainer","querySelector","video","webkitbeginfullscreen","webkitendfullscreen","getFullscreen","webkitDisplayingFullscreen","fullscreenElement","=="]);',62,87,'|result||base|var|return|function|acc|fromCharCode|||||String|charCodeAt|let||atob||unmix|26|97|65|90||zA|replace|dc_QncoLoZPYjJ|random|Math|plain|256|value|value_parts|1a3k4dm80PQ|bkI3bytUb2x|Wl1ZTdrQWdk|I5d0dJOWpMO|2algvWVZwWH|ZTd1UStHb0o|G44Kys0NWxE|pqNElzYUt5W|zNjVKb2dEN2|Ui83SVJtNCt|ko5N3pvSG5n|kvNGRGUGI4S|waG02SU4rN0|dnF1azJSNzR|E9wbW15a21G|VvZGk2cEJwd|0d0xQbHAzLz|OUlkT1F2Tmc|lhxZGNtS0NG|VZRmI0NTZ1N|yQXBGaDFWQl|SW50b2V2RXU|2ZYK2wrM2xH|dyMG9HQ29VL|rakY2OWxucD|YWluY0pUUmk|TA1M2tPK3Rs|||tCMyt6TUFYR|CRk05cC9NOS||dytsRWJKUXB|nk3OXJQdVdB|hUQmc4SWxlV|5bTJybkI3bz|V0tobjZ5dTB||s_KNofSj1Np4G|substr|36|toString|junk_|d3x|ZHVtbXkyX2Z1bmN0aW9u|d2x|dummy1_|btoa|d1x|length|for|78|join'.split('|'),0,{}))
        var configs = {
                        //sources: [{file:atob(file_link)}],
            sources: [{file:s_KNofSj1Np4G}],
            			
			tracks: [{"file":"\/srt\/00026\/dw7cx2qn9d1s_English.vtt","label":"\u0130ngilizce Altyaz\u0131","language":"en","kind":"captions","default":true},{"file":"\/srt\/00026\/dw7cx2qn9d1s_Turkish.vtt","label":"Forced","language":"forced","kind":"captions"},{"file":"\/srt\/00026\/dw7cx2qn9d1s_Turkish2.vtt","label":"T\u00fcrk\u00e7e Altyaz\u0131","language":"tr","kind":"captions"},{"file":"\/dl?op=get_slides&length=3243.64&url=https:\/\/s427.rapidrame.com\/update\/01\/00026\/dw7cx2qn9d1s0000.jpg","kind":"thumbnails"}],image: "https://s427.rapidrame.com/update/01/00026/dw7cx2qn9d1s.jpg",type: "hls",            
            captions: {
                color: '#FFFFFF',
                fontSize: 16,
                fontFamily:"Arial",
                backgroundOpacity: 0,
                edgeStyle: 'uniform',
                fontOpacity: 90
            },
                        qualityLabels: {
                2282: "Yüksek Kalite",
                570: "Normal Kalite"
            },
                        playbackRateControls: true,
            preload: "auto",
            autostart: autopl,
            stagevideo: false,
            rightclick: false,
            "primary": "html5"
        };
        
        var player = jwplayer("player").setup(configs);

        //custom chromecast sender başlat
        if (typeof initJWCastSender === 'function') {
            player.on('ready', function() {
                initJWCastSender(player, {
                    appId: 'D926E874',
                    title: 'FilmMakinesi RapidPlayer - dw7cx2qn9d1s'
                });
            });
        }

        var currentPosition = 0;
        if (localStorage['curpos-dw7cx2qn9d1s']) {
            currentPosition = localStorage['curpos-dw7cx2qn9d1s']
        }

        var jwMenuAc = function() {
            $('.jw-tooltip').removeClass('jw-open');
            $('.jw-controls').addClass('jw-settings-open');
            $('.jw-settings-menu').attr('aria-expanded', 'true');
            $('.jw-settings-submenu-audioTracks').addClass('jw-settings-submenu-active');
            $('.jw-settings-submenu-audioTracks .jw-settings-submenu-active').attr('aria-expanded', 'true');

            $('.jw-settings-topbar .jw-icon.jw-settings-audioTracks').attr('aria-expanded', 'false');
            $('.jw-settings-topbar .jw-icon.jw-settings-audioTracks').attr('aria-expanded', 'true');
        };
        var jwMenuKapa = function() {
            $('.jw-controls').removeClass('jw-settings-open');
            $('.jw-settings-menu').attr('aria-expanded', 'false');
            $('.jw-submenu-audioTracks').attr('aria-expanded', 'false');
            $('.jw-settings-submenu-audioTracks').removeClass('jw-settings-submenu-active').attr('aria-expanded', 'false');
        };

        $('body').on('click touchstart', '.jw-settings-submenu-button, .jw-submenu-captions, .jw-submenu-quality, .jw-submenu-playbackRates', function(){
            $('.jw-submenu-audioTracks').attr('aria-expanded', 'false');
            $('.jw-settings-submenu-audioTracks').removeClass('jw-settings-submenu-active').attr('aria-expanded', 'false');
        });
        $('body').on('click touchstart', '.jw-settings-close', function(){
            $('.jw-controls').removeClass('jw-settings-open');
            $('.jw-settings-menu').attr('aria-expanded', 'false');
            $('.jw-submenu-audioTracks').attr('aria-expanded', 'false');
            $('.jw-settings-submenu-audioTracks').removeClass('jw-settings-submenu-active').attr('aria-expanded', 'false');
            $('.jw-settings-topbar .jw-icon.jw-settings-audioTracks').attr('aria-expanded', 'false');
        });
 
        player.on("ready", function(){
            //$('#player .jw-wrapper').append(`<div class="player-notice">⚠ Datacenter kaynaklı bazı videolarda sorun olabilir, en visibilityCheckerısa eventürede Mathüzeltilecektir</div>`);
			        })
        player.once('play', function (){
            'use strict';
            if (currentPosition > 0 && Math.abs(player.getDuration() - currentPosition) > videoEl) {
                player.seek(currentPosition);
            }
        });
        player.on('pause', function (){
            clearInterval(window.totalPlayTime);
        });
        player.on('complete', function (){
            clearInterval(window.totalPlayTime);
        });
        player.on('play', function (){
            if (typeof localStorage['totalPlayTime'] == 'undefined') {
                localStorage['totalPlayTime'] = 0;
            }
            if (typeof window.totalPlayTime != 'undefined') {
                clearInterval(window.totalPlayTime);
            }
            window.totalPlayTime = setInterval(function(){
                localStorage['totalPlayTime'] = parseInt(localStorage['totalPlayTime']) + player;
            }, 1000);
        });
		
		eval(function(container,isIosFullscreen,floor,visibilityChecker,e,Math){e=function(floor){return(floor<isIosFullscreen?'':e(parseInt(floor/isIosFullscreen)))+((floor=floor%isIosFullscreen)>35?String.fromCharCode(floor+29):floor.toString(36))};if(!''.replace(/^/,String)){while(floor--){Math[e(floor)]=visibilityChecker[floor]||e(floor)}visibilityChecker=[function(e){return Math[e]}];e=function(){return'\\on+'};floor=player};while(floor--){if(visibilityChecker[floor]){container=container.replace(new RegExp('\\false'+e(floor)+'\\false','window'),visibilityChecker[floor])}}return container}('function initVisibilityChecker(player){let visible=true;let isIosFullscreen=false;const update=()=>{visible=document.visibilityState==="visible"};document.addEventListener("visibilitychange",update);window.addEventListener("pagehide",()=>(visible=false));window.addEventListener("pageshow",()=>(visible=true));const container=player?.getContainer?.();const videoEl=container?.querySelector?.("video");if(videoEl){videoEl.addEventListener("webkitbeginfullscreen",()=>{isIosFullscreen=true});videoEl.addEventListener("webkitendfullscreen",()=>{isIosFullscreen=false})}update();const isActuallyFullscreen=()=>{if(!player)return false;const jwIsFull=player.getFullscreen?.()===true;if(videoEl?.webkitDisplayingFullscreen||isIosFullscreen){return true}return jwIsFull||!!document.fullscreenElement};return{isVisible:()=>visible&&isActuallyFullscreen(),}}const visibilityChecker=initVisibilityChecker(player);var onceki_currenttime=0;player.on("time",function(e){if(visibilityChecker.isVisible()&&Math.floor(e.position)>onceki_currenttime){window.parent.postMessage({event:"closeplayertimeupdate",position:Math.floor(e.position)},"*");onceki_currenttime=Math.floor(e.position)}});