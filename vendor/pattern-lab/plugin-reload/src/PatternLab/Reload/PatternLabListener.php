<?php

/*!
 * Reload Listener Class
 *
 * Copyright (c) 2016 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 *
 * Adds automatic browser reload support to Pattern Lab
 *
 */

namespace PatternLab\Reload;

use \PatternLab\Config;
use \PatternLab\Console;
use \PatternLab\Console\ProcessSpawnerEvent;
use \PatternLab\Data;

class PatternLabListener extends \PatternLab\Listener {
  
  /**
  * Add the listeners for this plug-in
  */
  public function __construct() {
    
    // add listener
    $this->addListener("processSpawner.getPluginProcesses","addProcess");
    
  }
  
  /**
  * Add command to initialize the websocket server
  */
  public function addProcess(ProcessSpawnerEvent $event) {
    
    if ((bool)Config::getOption("plugins.reload.enabled")) {
      
      // only run this command if watch is going to be used
      if (Console::findCommand("w|watch") || Console::findCommandOption("with-watch")) {
        
        // set-up the command
        $pathPHP      = Console::getPathPHP();
        $pathReload   = __DIR__."/AutoReloadServer.php";
        $command      = "exec ".$pathPHP." ".$pathReload;
        
        // send the processes on their way
        $processes     = array();
        $processes[]   = array("command" => $command, "timeout" => null, "idle" => 600, "output" => false);
        $event->addPluginProcesses($processes);
        
      }
      
    }
    
  }
  
}
