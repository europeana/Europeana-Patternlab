<?php

/*!
 * Auto-Reload Server
 *
 * Copyright (c) 2013-2016 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 *
 * The web socket server that clients attach to to learn about content updates.
 *
 */

require(__DIR__."/../../../../../autoload.php");

$server = new \Wrench\BasicServer('ws://localhost:8000', array('allowed_origins' => array('localhost')));
$server->registerApplication('reload', new \PatternLab\Reload\AutoReloadApplication());
$server->run();
