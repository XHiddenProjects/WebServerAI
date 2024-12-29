<?php
namespace WebServerAI\Modal;
session_start();
use WebServerAI\Pipe\Pipe;
require_once('ai_pipe.php');
class Modal extends Pipe {
    /**
     * Creates a modal
     *
     * @param string $modal WebServerAI Modals
     */
    protected $modal;
    public function __construct(string $modal, string $url) {
        $dest = dirname(__DIR__).'/modals';
        parent::__construct($url,$dest);
        $this->modal = $modal;
        return $this;
    }
    public function add(){
        parent::encrypt($this->modal);
    }
    public function read():string{
        return parent::decrypt($this->modal);
    }
    public function remove():bool{
        return parent::delete($this->modal);
    }
    public function validate():bool{
        return parent::check($this->modal);
    }
}

if(isset($_REQUEST['action'])){
    $modal = new Modal($_REQUEST['modal'],$_REQUEST['modal_url']);
    $path = dirname(__DIR__).'/modals/'.$_REQUEST['modal'].'.wsam';
    switch(strtolower($_REQUEST['action'])){
        case 'add':
            $modal->add();
        break;
        case 'read':
            echo $modal->read();
        break;
        case 'remove':
            echo $modal->remove();
        break;
        case 'check':
            echo $modal->validate();
        break;
    }
}

?>