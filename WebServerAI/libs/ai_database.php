<?php
namespace WebServerAI\Database;

use SQLite3;

class Database{
    protected $sqlite;
    /**
     * Creates a new SQLite database
     * @param string $filepath Filepath of the sqlite file
     * @param int $flags Flags to the database
     * @param string $encKey Encryption key for the database
     * @return void
     */
    public function __construct(string $filepath, int $flags=SQLITE3_OPEN_READWRITE|SQLITE3_OPEN_CREATE, string $encKey=''){
        $this->sqlite = new SQLite3($filepath,$flags,$encKey);
    }
    /**
     * Enables expectations to the sqlited
     * @param bool $enabled Set the expectation to display
     * @return bool
     */
    public function enableExpectations(bool $enabled=true):bool{
        return $this->sqlite->enableExceptions($enabled);
    }
    /**
     * Creates a new table to the database
     * @param string $tableName Create a name for the table
     * @param array $datasets Give names for each datasets
     * @return bool
     */
    public function createTable(string $tableName, array $datasets):bool{
        return $this->sqlite->exec('CREATE TABLE IF NOT EXISTS '.$tableName.'('.implode(',',$datasets).')');
    }
    /**
     * Deletes a selected table
     * @param string $tableName Table to drop
     * @return bool
     */
    public function deleteTable(string $tableName):bool{
        $this->sqlite->exec('PRAGMA foreign_keys = OFF');
        $dropped = $this->sqlite->exec('DROP TABLE IF EXISTS '.$tableName);
        $this->sqlite->exec('PRAGMA foreign_keys = ON');
        return $dropped;
    }
    /**
     * Inserts data to the table
     * @param string $tableName Table to insert data
     * @param string|array $datasets Data to select to insert data
     * @param string|array $values Values to insert into the table
     * @return bool
     */
    public function insertData(string $tableName, string|array $datasets, string|array $values):bool{
        if(is_array($datasets)){
            if(is_array($values)){
                return $this->sqlite->exec('INSERT INTO '.$tableName.'('.implode(',',$datasets).') VALUES ('.implode(',',array_map(function($v){return (gettype($v)==='string' ? '\''.$v.'\'' : $v);},$values)).')');
            }else{
                return $this->sqlite->exec('INSERT INTO '.$tableName.'('.implode(',',$datasets).') VALUES ('.(gettype($values)==='string' ? '\''.$values.'\'' : $values).')');
            }
        }else{
            if(is_array($values)){
                return $this->sqlite->exec('INSERT INTO '.$tableName.'('.$datasets.') VALUES ('.implode(',',array_map(function($v){return (gettype($v)==='string' ? '\''.$v.'\'' : $v);},$values)).')');
            }else{
                return $this->sqlite->exec('INSERT INTO '.$tableName.'('.$datasets.') VALUES ('.(gettype($values)==='string' ? '\''.$values.'\'' : $values).')');
            }
        }
    }
    /**
     * Escapes the string
     * @param string $str String to escape
     * @return string Escaped string
     */
    public function escape(string $str){
        return $this->sqlite->escapeString($str);
    }
    /**
     * Selects data from the table
     * @param string $tableName Table to select
     * @param string|array $datasets Selected data's
     * @param string $extras [Optional] - Filter more from it
     */
    public function selectData(string $tableName, string|array $datasets, string $extras=''){
        $data=array();
        if(is_array($datasets)){
            $results = $this->sqlite->query('SELECT '.implode(',',$datasets).' FROM '.$tableName);
            while($row = $results->fetchArray(SQLITE3_ASSOC)){
                array_push($data,$row);
            }
            return json_encode($data,JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);
        }else{
            $results = $this->sqlite->query('SELECT '.$datasets.' FROM '.$tableName.($extras ? ' '.$extras : ''));
            while($row = $results->fetchArray(SQLITE3_ASSOC)){
                array_push($data,$row);
            }
            return json_encode($data,JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);
        }
    }
    /**
     * Correctly formats the condition to look for
     * @param array $datasets Data(s) to select
     * @param array $values Value(s) to check for
     * @param array $searchQuery Checks for the following; ==, !=, <, >, <=, >=
     * @param array $cond Continues the condition using _AND_ / _OR_
     * @return string Formatted condition
     */
    public function conditionFormatter(array $datasets, array $values, array $searchQuery, array $cond):string{
        $condition='';
        for($i=0;$i<count($datasets);$i++){
            $condition.=$datasets[$i].(isset($searchQuery[$i]) ? $searchQuery[$i] : '==').(isset($values[$i]) ? (gettype($values[$i])==='string' ? '\''.$values[$i].'\'' : $values[$i]) : '\'\'').(isset($cond[$i]) ? ' '.strtoupper($cond[$i]).' ':'');
        }
        return $condition;
    }

    /**
     * Removes data based on a condition
     * @param string $tableName Table name to select
     * @param string|null $condition set a condition to search for
     * @return bool
     */
    public function removeData(string $tableName, string|null $condition=null):bool{
        return $this->sqlite->exec('DELETE FROM '.$tableName.($condition ? ' WHERE '.$condition : ''));
    }
    /**
     * Updates data to a certain dataset(s)
     * @param string $tableName Table to select
     * @param array $datasets Data to update
     * @param array $values The updated values
     * @param string $extras Update a specific query
     * @return bool
     */
    public function updateData(string $tableName, array $datasets, array $values, string $extras=''):bool{
        $totaledUp = '';
        for($i=0;$i<count($datasets);$i++){
            $totaledUp.=$datasets[$i].' = '.(isset($values[$i]) ? (gettype($values[$i])==='string' ? '\''.$values[$i].'\'' : $values[$i]) : '\'\'').','; 
        }
        $totaledUp = preg_replace('/,$/','',$totaledUp);
        return $this->sqlite->exec('UPDATE '.$tableName.' SET '.$totaledUp.($extras ? ' '.$extras : ''));
    }

    /**
     * Closes the sqlite database
     * @return bool 
     */
    public function close():bool{
        return $this->sqlite->close();
    }
}
?>