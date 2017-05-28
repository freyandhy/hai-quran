function ucwords (str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}

function playSurahAyat(surat,ayat) {
    var suratAyat = surat + ':' + ayat;
    var title = "Surah " + surat + " Ayat " + ayat;

    var urlAr = 'http://api.alquran.cloud/ayah/'+suratAyat+'/ar.alafasy';
    var urlId = 'http://api.alquran.cloud/ayah/'+suratAyat+'/id.indonesian';

    $(".content").show();
    $(".progress").show();

    $('#text').text(title);

    $.getJSON(urlId, function(result,status){
        if(status == 'success') {
            var dataText = result.data.text;

            $('#id').text(dataText);
        }
    });

    $.getJSON(urlAr, function(result,status){
        if(status == 'success') {
            var dataText = result.data.text;
            var dataAudio = result.data.audio;

            $(".progress").hide();

            $('#ar').text(dataText);
            $('#audio').attr("src", dataAudio);
            $('#audio')[0].play();
        }
    });
}

if(annyang) {

    $(".content").hide();

    var showSurahAndAyat = function(tag) {
        var kalimat = tag.split(' ');

        /* $('#text').text(ucwords(tag)); */
        $('#surat').val(kalimat[1]);
        $('#ayat').val(kalimat[3]);

        playSurahAyat(kalimat[1],kalimat[3]);
    };

    var repeatSurahAndAyat = function(){
        var surat = $("#surat").val();
        var ayat = $("#ayat").val();

        playSurahAyat(surat,ayat);

        $('#surat').val(surat);
        $('#ayat').val(ayat);
    };

    var nextSurahAndAyat = function(){
        var surat = $("#surat").val();
        var ayat = parseInt($("#ayat").val())+1;

        playSurahAyat(surat,ayat);

        $('#surat').val(surat);
        $('#ayat').val(ayat);
    };

    var previousSurahAndAyat = function(){
        var surat = $("#surat").val();
        var ayat = parseInt($("#ayat").val())-1;

        playSurahAyat(surat,ayat);

        $('#surat').val(surat);
        $('#ayat').val(ayat);
    };

    var commands = {
        'baca *tag': showSurahAndAyat,
        'ulangi': repeatSurahAndAyat,
        'lagi': repeatSurahAndAyat,
        'selanjutnya': nextSurahAndAyat,
        'lanjut': nextSurahAndAyat,
        'next': nextSurahAndAyat,
        'sebelumnya': previousSurahAndAyat,
        'previous': previousSurahAndAyat
    };

    annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
      console.log(userSaid); // sample output: 'hello'
      console.log(commandText); // sample output: 'hello (there)'
      console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
    });
    
    annyang.setLanguage('id');
    annyang.addCommands(commands);

    annyang.debug(true);
    
    $('#listening').click(function(){
        $("#listening").addClass('pulse');
        annyang.start({ autoRestart: true, continuous: true });    
    });
}