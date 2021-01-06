
$(document).ready(function() {
    function UpdateData()
    {
        $('#data-table')
            .bootstrapTable('destroy')
            .bootstrapTable( { data : window.data } )

        const x = 
        $('#time-sleep'     ).text(MeanDeviationFormat(...mean( window.data.map( item => item['time-sleep'     ]))))
        $('#awakes'         ).text(MeanDeviationFormat(...mean( window.data.map( item => item['awakes'         ]))))
        $('#interval-awaked').text(MeanDeviationFormat(...mean( window.data.map( item => item['interval-awaked']))))

    }

    function LoadDataset(name = 'default')
    {
        if ( !localStorage.getItem('datasets') )
            return
             
        const datasets = JSON.parse(localStorage.getItem('datasets'))
        if (!datasets[name])
            return

        window.data = datasets[name]
        UpdateData()
    }


    function MeanDeviationFormat( mean, deviation, precision = 1)
    {
        const factor = Math.pow(10, precision)
        let   pair

        pair = [mean, deviation].map( value => Math.round(value * factor) / factor)
        return pair[0] + '\u00b1' + pair[1]
    }

    function mean(values)
    {
        let sum
        let mean
        let deviation

        sum = 0
        count = 0
        for(let value of values)
        {
            if ( ((value == 0) && (!value)) || isNaN(value) )
                continue

            sum += value
            count++
        }
        mean = sum / count
        
        sum = 0
        for(let value of values)
        {
            if ( ((value == 0) && (!value)) || isNaN(value) )
                continue

            sum += (value - mean) * (value - mean)
        }
        deviation = Math.sqrt(sum / (count - 1))

        return [mean, deviation]
    }


    const Sleep = (milliseconds) => new Promise( (onTimeout) => setTimeout(onTimeout, milliseconds) )

    window.data = []

    $('#data-collect').click(() => {
        $('#date').val('')
        $('#f1'  ).val('')
        $('#f2'  ).val('')
        $('#f3'  ).val('')
        $('#f4'  ).val('')
        $('#f5'  ).val('')
        $('#f6'  ).val('')
        $('#f7'  ).val('')

        $('#data-form').modal('show')
    })

    $('#data-export').click(async () => {
        const lines = []

        for(line of data)
        {
            const fields = []
            for(field in line) fields.push(line[field])
            lines.push(fields.join(','))
        }

        const file = $('<a></a>')
                        .attr('href',     'data:text/plain;charset=utf-8,' + encodeURIComponent(lines.join('\n')))
                        .attr('download', 'condor-data.csv')
                        .attr('rel',      '_blank')
        
        await Sleep(100)
        file[0].click()
    })

    $('#data-clear').click(async () => {
        data = []
        UpdateData()
    })

    ///*
    $('#date').datepicker({
        format: 'dd-mm-yyyy',
        todayHighlight: true,
        toggleActive: true,
        language: 'pt-BR',
        autoclose : true,
        container : $('#container')
    });

    $('#data-table').bootstrapTable()

    // End of initalizations
   

    $('#save').click( () => {
        $('#data-form').modal('hide')

        window.data.push({
            'date'            : $('#date').val(),
            'time-bed'        : $('#f1'  ).val(),
            'time-lights'     : $('#f2'  ).val(),
            'time-sleep'      : $('#f3'  ).val(),
            'awakes'          : parseInt($('#f4').val()),
            'interval-awaked' : parseInt($('#f5').val()),
            'time-awake'      : $('#f6'  ).val(),
            'time-wakeup'     : $('#f7'  ).val(),
            'interval-sleep'  : 0
        })
        UpdateData()
    })

    const parameters = new URLSearchParams(window.location.search)
    LoadDataset(parameters.has('dataset') ? parameters.get('dataset') : 'default')

    $(document).keydown( (e) => {
        if (e.defaultPrevented)
            return

        if ( e.shiftKey && !e.ctrlKey && !e.altKey && (e.key == 'F')) 
        {
                e.preventDefault()

                $('#date').val('06-01-2021')
                $('#f1'  ).val('23:00')
                $('#f2'  ).val('23:15')
                $('#f3'  ).val('?')
                $('#f4'  ).val(5)
                $('#f5'  ).val(33)
                $('#f6'  ).val( '7:02')
                $('#f7'  ).val('07:15')
        }
    })


    
})

