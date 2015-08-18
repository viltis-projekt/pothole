<?php
require 'app_tokens.php';
require 'tmhOAuth-master/tmhOAuth.php';

// Read URL parameters to set the search string to send to Twitter
if (isset($_GET['q'])) 
{
    $q = "#JalanLubang_SBY";
}
else
{
    $q = "#JalanLubang_SBY"; // if not parameter fed, default to this
}

if (isset($_GET['geocode'])) 
{
    $geocode = $_GET['geocode'];
}
else
{
    $geocode = "";
}

if (isset($_GET['count'])) 
{
    $count = $_GET['count'];
}
else
{
    $count = "100";
}

if (isset($_GET['since_id'])) 
{
    $since_id = $_GET['since_id'];
}
else
{
    $since_id = "";
}

if (isset($_GET['callback'])) 
{
    $callback = $_GET['callback'];
}
else
{
    $callback = "";
}

if (isset ($_GET['include_entities']))
{
	$include_entities = $_GET['include_entities'];
}
else
{
	$include_entities = "true";
}

// grab the authentication keys and tokens
$connection = new tmhOAuth(array(
    'consumer_key' => $consumer_key,
    'consumer_secret' => $consumer_secret,
    'user_token' => $user_token,
    'user_secret' => $user_secret
));

// Connect to the Twitter API
$http_code = $connection->request('GET',
    $connection->url('1.1/search/tweets.json'),
    array('q' => $q, 'count' => $count, 'geocode' => $geocode, 'since_id' => $since_id, 'callback' => $callback, 'include_entities' => $include_entities));

// If request was successful
if ($http_code == 200) 
{
    // Extract the tweets from the API response
    header ("Content-Type:application/json");  
    $response = $connection->response['response'];
    echo $response;
}
// Handle errors from API request
else 
{
    if ($http_code == 429) 
    {
        print 'Error: Twitter API rate limit reached';
    }
    else 
    {
         $response = $connection->response['response'];
        echo $response;
        print 'Error: Twitter was not able to process that request';
    }
} 
?>