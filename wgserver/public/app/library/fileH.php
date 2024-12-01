<?php

class fileH
{
    public static  function fileLoad($filePath, $json = false)
    {
        $content = file_get_contents($filePath);
        return $json ?  json_decode($content, true) : $content;
    }

    public static function remove_empty_lines($string)
    {
        $string = str_replace(array("\r\n", "\r"), "\n", $string);
        $lines = explode("\n", $string);
        $lines = array_map('trim', $lines);
        $lines = array_filter($lines, function ($value) {
            return $value !== '';
        });
        return implode("\n", $lines);
    }


    public static function replaceBetween(
        $str,
        $replacementList,
        $needleStart = '%',
        $needleEnd = '%',
    ) {
        foreach ($replacementList as $key => $value) {
            $key = $needleStart . $key . $needleEnd;
            $str = str_replace($key, $value, $str);
        }
        return $str;
    }
    public static  function mescape($val)
    {
        return escapeshellcmd($val);
    }
    public static function escapeShell($params)
    {
        $result = [];
        foreach ($params as $key => $value) {
            $result[fileH::mescape($key)] = fileH::mescape($value);
        }
        return $result;
    }
}
