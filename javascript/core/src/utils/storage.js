
// -- Хранилище ---
var storage = {

    enable:  0,

    init: function ()
    {
        if (storage.is_enable())
        {
            storage.enable = 1;
        }

    } ,

    is_enable: function ()
    {
        try
        {
            return 'localStorage' in window && window['localStorage'] !== null;
        }
        catch (e)
        {
            return false;
        }
    } ,

    save: function (key,val)
    {
        if (storage.enable)
        {
            localStorage.setItem(key,val);
        }
    } ,

    load: function (key,def)
    {
        var result = def ? def : null;

        if (storage.enable && localStorage.getItem(key))
        {
            result = localStorage.getItem(key);
        }

        return result;
    } ,

    array: {

        load: function (key)
        {
            var result = [];
            var value = null;

            value = storage.load(key);
            value = json.parse(value);
            if (value)
                result = value;

            return result;
        } ,

        save: function (key,val)
        {
            storage.save(key,json.encode(val));
        } ,

        add: function (key,val)
        {

        }
    }
}

storage.init();
