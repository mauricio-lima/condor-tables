
$(document).ready(function() {
    function UpdateData()
    {
        values = []
        for(const [key, value] of Object.entries(window.data))
        {
            values.push(value)
        }
        const sequence = {
            'time-sleep'      : values.map( item => item['time-sleep'     ]),
            'awakes'          : values.map( item => item['awakes'         ]),
            'interval-awaked' : values.map( item => item['interval-awaked'])
        }

        $('#data-table')
            .bootstrapTable('destroy')
            .bootstrapTable( { data : values } )

        ChartSetup(sequence['time-sleep'], sequence['awakes'], sequence['interval-awaked'].map(item => item / 60))

        $('#time-sleep'     ).text(MeanDeviationFormat(...mean( values.map( item => item['time-sleep'     ]))))
        $('#awakes'         ).text(MeanDeviationFormat(...mean( values.map( item => item['awakes'         ]))))
        $('#interval-awaked').text(MeanDeviationFormat(...mean( values.map( item => item['interval-awaked']))))
    }

    function InputDialogShow()
    {
        $('#date').val('')
        InputDialogSetFields()

        if ( $('#data-form').is(':visible') )
            return
            
        $('#data-form').modal('show')
    }

    function InputDialogSetFields()
    {
        const result = window.data[$('#date').val()]
        if (!result)
        {
            //$('#date').val('')
            $('#f1'  ).val('')
            $('#f2'  ).val('')
            $('#f3'  ).val('')
            $('#f4'  ).val('')
            $('#f5'  ).val('')
            $('#f6'  ).val('')
            $('#f7'  ).val('')
    
            return
        }

        $('#f1'  ).val(result['time-bed'       ])
        $('#f2'  ).val(result['time-lights'    ])
        $('#f3'  ).val(result['time-sleep'     ])
        $('#f4'  ).val(result['awakes'         ])
        $('#f5'  ).val(result['interval-awaked'])
        $('#f6'  ).val(result['time-awake'     ])
        $('#f7'  ).val(result['time-wakeup'    ])
        $('#f8'  ).val(result['interval-sleep' ])
    }

    function LoadDataset(name = 'default')
    {
        if ( !localStorage.getItem('datasets') )
            return
             
        const datasets = JSON.parse(localStorage.getItem('datasets'))
        if (!datasets[name])
            return

        for(const value of datasets[name])
        {
            window.data[value.date] = new Information(value)
        }
        UpdateData()
    }

    function ChartSetup(a, b, c)
    {
        var dom = document.getElementById("container");
        var myChart = echarts.init(dom);
        var app = {};
    
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'cross',
                    crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                //dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        legend: {
            data: ['Tempo para iniciar o sono', 'Tempo acordado', 'Quanto tempo dormiu']
        },
        xAxis: [
            {
                type: 'category',
                data: Object.keys(window.data),
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: 'Horas',
                min: 0,
                max      : 14,
                interval : 2,
                axisLabel: {
                formatter: '{value} h'
                }
            },
            {
                type      : 'value',
            name      : 'Quantidade',
            min       : 0,
            max       : 21,
            interval  :  3,
            axisLabel : {
                formatter: '{value}'
            }
        }
    ],
    series: [
        {
            name: 'Tempo para iniciar o sono',
            type: 'bar',
            data:  a
        },
        {
            name: 'Tempo acordado',
            type: 'bar',
            data:  b
        },
        {
            name: 'Quanto tempo dormiu',
            type: 'line',
            yAxisIndex: 1,
            data:  c
        }
    ]
}

        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
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


    $('#data-collect').click(() => {
        InputDialogShow()
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
        window.data = []
        UpdateData()
    })

    $('#date')
        .datepicker({
            format         : 'dd-mm-yyyy',
            todayHighlight :  true,
            toggleActive   :  true,
            language       : 'pt-BR',
            autoclose      :  true,
            container      : $('#container')
        })
        .change( InputDialogSetFields )
   
    $('#save').click( () => {
        $('#data-form').modal('hide')

        let date = $('#date').val()
        
        window.data[date] = {
            'date'            : date,
            'time-bed'        : $('#f1'  ).val(),
            'time-lights'     : $('#f2'  ).val(),
            'time-sleep'      : parseInt($('#f3').val()),
            'awakes'          : parseInt($('#f4').val()),
            'interval-awaked' : parseInt($('#f5').val()),
            'time-awake'      : $('#f6'  ).val(),
            'time-wakeup'     : $('#f7'  ).val(),
            'interval-sleep'  : $('#f8'  ).val()
        }
        UpdateData()
    })


    $(document).keydown( (e) => {
        if (e.code == 'KeyF') 
        {
            if (!e.shiftKey && e.ctrlKey && e.altKey)
                return

            if (e.defaultPrevented)
                return
                
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

        if (e.code == 'KeyI')                          // I
        {
            if (e.shiftKey && !e.ctrlKey && e.altKey)  //  Only Ctrl together
                return

            e.preventDefault()
            InputDialogShow()
        }
    })

    $('#data-table').bootstrapTable({  
        columns : [
            { align : 'center' }, { align : 'center' }, { align : 'center' },
            { align : 'center' }, { align : 'center' }, { align : 'center' }, 
            { align : 'center' }, { align : 'center' }, { align : 'center' }
        ]
    }) 

    window.data = {}
    
    const Information = function(value) {
        return new Proxy(value, {
            set: function(target, property, value) {
                let changed

                changed = false
                if (target[property] != value)
                {
                    target[property] = value
                    changed = true
                    UpdateData()
                }
                    
                //console.log('set : ', 'property <' + prop + '> with value <' + newval + '>')
            }
        })
    } 

    const parameters = new URLSearchParams(window.location.search)
    LoadDataset(parameters.has('dataset') ? parameters.get('dataset') : 'default')
    
})

