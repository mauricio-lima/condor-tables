
$(document).ready(function() {
    const data = []

    $('#data-collect').click(() => {
        $('#data-form').modal('show')
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

        data.push({
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
        $('#data-table')
            .bootstrapTable(  'destroy'      )
            .bootstrapTable( { data : data } )

        console.log(JSON.stringify(data))
    })

    


        $(document).keydown( (e) => {
            if (e.defaultPrevented)
                return

            if ( (e.shiftKey) && (e.key == 'F')) 
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

